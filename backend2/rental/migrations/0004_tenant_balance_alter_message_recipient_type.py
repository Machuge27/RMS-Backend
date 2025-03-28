# Generated by Django 5.0.1 on 2025-01-26 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rental', '0003_message_building_message_recipient_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tenant',
            name='balance',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='message',
            name='recipient_type',
            field=models.CharField(choices=[('all_tenants', 'All Tenants'), ('specific_tenants', 'Specific Tenants'), ('specific_building', 'Specific Building'), ('admin', 'Admin')], max_length=20),
        ),
    ]
