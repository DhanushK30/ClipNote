# D:\ClipNote\backend\users\views.py

from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

# A view that allows creating a new user (registration)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Allow any user (even unauthenticated ones) to access this endpoint
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer