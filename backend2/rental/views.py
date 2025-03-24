from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view,authentication_classes
from rest_framework.decorators import permission_classes,api_view
from rest_framework.authentication import TokenAuthentication
from .models import User, Tenant, Building, Room, Payment, Notification, Message
from .serializer import UserSerializer, TenantSerializer, BuildingSerializer, RoomSerializer, NotificationSerializer, MessageSerializer 
from django.db.models import Sum

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Authenticate admin user using username and password
            # admin_username = serializer.validated_data['AdminUsername']
            # admin_password = serializer.validated_data['AdminPassword']
            # admin_instance = authenticate(username=admin_username, password=admin_password)
            # if not admin_instance:
            #     return Response({"Error": 'Incorrect Admin credentials'}, status=status.HTTP_400_BAD_REQUEST)

            # # Create a new user if the admin is authenticated
            # if not admin_instance.is_superuser:
            #     return Response({"Error": 'You are not Allowed to perform the operation'}, status=status.HTTP_403_FORBIDDEN)

            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password'],
                is_Admin=serializer.validated_data['is_Admin'],
                # email=serializer.validated_data['email']
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            user_data = {
                "username": user.username,
                "isAdmin": user.is_Admin,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }

            return Response(user_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AddTenant(generics.CreateAPIView):
    queryset = Tenant.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TenantSerializer
    

    def get(self, request, *args, **kwargs):
        owner_id = request.user.id
        print(request.user)
        
        # Fetch all buildings owned by the user
        buildings = Building.objects.filter(owner=owner_id)
        for building in buildings:
            print(building)
        
        # Collect all rooms across buildings
        rooms = Room.objects.filter(building__in=buildings)
        for room in rooms:
            print('Room ID:', room.room_no)
        
        # Collect all tenants in those rooms
        tenants = Tenant.objects.filter(room__in=rooms)
        for tenant in tenants:
            print('Tenant ID:', tenant.id)
        
        # Calculate the total amount of money paid by all tenants
        total_payments = Payment.objects.filter(tenant__in=tenants).aggregate(total=Sum('amount'))['total'] or 0
        print('Total Payments:', total_payments)
        
        notifications = Notification.objects.filter(user=request.user)
        messages = Message.objects.filter(user=request.user)
        total_notifications = notifications.count() + messages.count()
        print('Total Notifications:', total_notifications)
        
        # Serialize the data
        buildingSerializer = BuildingSerializer(buildings, many=True)
        roomSerializer = RoomSerializer(rooms, many=True)
        tenantsSerializer = self.get_serializer(tenants, many=True)
        count = tenants.count()
        
        return Response({
            "buildings": buildingSerializer.data,
            "rooms": roomSerializer.data,
            "tenants": tenantsSerializer.data,
            "count": count,
            "total_payments": total_payments,
            "notifications": total_notifications,
        }, status=status.HTTP_200_OK)

        
    def post(self, request, *args, **kwargs):
        print(request.data)  # Log the incoming request data
        data = request.data.copy()
        print("room", request.data["room"])
        instance = Room.objects.get(id=data['room'])
        data["room"] = instance.id
        data["vacancy"] = False  # Set room vacancy to false
        print("Ten", request.data)
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            print("Added 1 tenant")
            return Response({"message": "success"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
            id = request.query_params.get('id')
            instance = Tenant.objects.get(id=id)
            instance.delete()
            print(f"User {instance.username} deleted")  
            return Response({"message": "success"}, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
            idd = request.data.get('tenantName')
            instance=Tenant.objects.get(username=idd)
            prevRoom = Room.objects.get(id = instance.room.id)
            prevRoom.vacancy = True
            prevRoom.save()
            roomInstance = Room.objects.get(room_no = request.data.get('roomNumber'))
            data={
                "room":roomInstance.id,
                "vacancy":False,
                
            }
            serializer = self.get_serializer(instance, data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "success"}, status=status.HTTP_200_OK)
            return Response({"message": "Failed"}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoom(generics.CreateAPIView):
    queryset = Room.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RoomSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)  # Log the incoming request data
        data = request.data.copy()
        print("RCDATA", data)
        instance = Building.objects.get(id = data['building'])
        data["building"] = instance.id
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            print("Added 1 room")
            return Response({"message": "success"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        instance = Room.objects.get(id=id)
        instance.delete()
        print(f"Room {instance.room_no} deleted")  
        return Response({"message": "success"}, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
        id = request.data.get('roomNumber')
        instance=Room.objects.get(room_no=id)
        data={
            "vacancy":True,
        }
        serializer = self.get_serializer(instance, data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        return Response({"message": "Failed"}, status=status.HTTP_400_BAD_REQUEST)
        

class NotificationsAndMessages(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]  
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    def get(self, request, *args, **kwargs):
        user = request.user

        if user.is_Admin:
            # Admin-specific logic
            # Get all buildings owned by the admin
            buildings = Building.objects.filter(owner=user)
            
            # Get all tenants in those buildings
            tenant_ids = Room.objects.filter(building__in=buildings).values_list('tenant__id', flat=True)

            # Get notifications for tenants in these buildings
            notifications = Notification.objects.filter(user__id__in=tenant_ids)
            notifications_serializer = NotificationSerializer(notifications, many=True)

            # Get messages from tenants in these buildings
            messages = Message.objects.filter(user__id__in=tenant_ids)
            messages_serializer = MessageSerializer(messages, many=True)

        else:
            # Non-admin-specific logic
            notifications = Notification.objects.filter(user=user)
            notifications_serializer = NotificationSerializer(notifications, many=True)

            messages = Message.objects.filter(recipients=user) | Message.objects.filter(user=user)
            messages_serializer = MessageSerializer(messages, many=True)

        # Combine notifications and messages in the response
        data = {
            "notifications": notifications_serializer.data,
            "messages": messages_serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        return Response({"message": "POST endpoint not implemented."}, status=status.HTTP_200_OK)
    
    
    def post(self, request, *args, **kwargs):
        
        print("Notifications", request.user)
        

class TenantData(generics.CreateAPIView):
    
    
    def get(self, request, *args, **kwargs):
        queryset = Tenant.objects.all()
        permission_classes = [IsAuthenticated]
        serializer_class = TenantSerializer
        
        tenantData = Tenant.objects.all()
        
        data = {
            "username": request.user.username,
            "email": request.user.email,
            "is_Admin": request.user.is_Admin,
            "balance": request.user.tenant.balance if hasattr(request.user, 'tenant') else 0,
        }
        return Response(data, status=status.HTTP_200_OK)