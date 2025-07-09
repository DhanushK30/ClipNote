# D:\ClipNote\backend\users\serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Fields to accept for registration
        fields = ('id', 'username', 'email', 'password')
        # Make the password write-only (it won't be sent back in API responses)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Use create_user to properly hash the password
        user = User.objects.create_user(
            validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user