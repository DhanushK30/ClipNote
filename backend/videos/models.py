# videos/models.py
from django.db import models
from django.contrib.auth.models import User

class Video(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.URLField(max_length=500, unique=True)
    source = models.CharField(max_length=50)  # 'youtube', 'vimeo', etc.
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Note(models.Model):
    content = models.TextField()
    timestamp = models.FloatField()  # Store time in seconds (e.g., 123.5)
    video = models.ForeignKey(Video, related_name='notes', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Note for {self.video.title} at {self.timestamp}s'