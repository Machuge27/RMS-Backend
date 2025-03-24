from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

# Custom User model extending AbstractUser
class User(AbstractUser):
    is_Admin = models.BooleanField(default=False)  # Distinguish between admin and regular user
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    phone = models.CharField(max_length=10)
    is_tenant = models.BooleanField(default=True)
    

    def __str__(self):
        return self.username

# Building model with ForeignKey to User (Owner/Admin)
class Building(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_Admin': True})
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    num_rooms = models.IntegerField()
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Room model with ForeignKey to Building
class Room(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    room_no = models.CharField(max_length=20, default="TX-001")
    rent = models.IntegerField()
    vacancy = models.BooleanField(default=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room {self.building.name}: {self.room_no}"

class Tenant(User):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, default=1)
    balance = models.FloatField(default=0)

# Payment model with ForeignKey to Tenant and Room
class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    amount = models.FloatField()
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment of {self.amount}  for {self.room}"

class Notification(models.Model):
    TYPE_CHOICES = [
        ('message', 'Message/Complaint'),
        ('rent_due', 'Rent Due'),
        ('report', 'Report'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")  # Associate with User

    def __str__(self):
        return f"{self.type}: {self.title} ({self.timestamp})"


class Message(models.Model):
    RECIPIENT_CHOICES = [
        ('all_tenants', 'All Tenants'),
        ('specific_tenants', 'Specific Tenants'),
        ('specific_building', 'Specific Building'),
        ('admin', 'Admin'),
    ]
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")  # Sender
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_CHOICES)
    recipients = models.ManyToManyField(User, related_name="received_messages", blank=True)  # Specific recipients
    building = models.ForeignKey(Building, on_delete=models.CASCADE, null=True, blank=True)  # Specific building

    def __str__(self):
        return f"Message to {self.recipient_type} at {self.timestamp}"