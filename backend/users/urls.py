# D:\ClipNote\backend\users\urls.py

from django.urls import path
from .views import RegisterView

urlpatterns = [
    # The URL for our registration view
    path('register/', RegisterView.as_view(), name='register'),
]