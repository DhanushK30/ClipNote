# videos/serializers.py
from rest_framework import serializers
from .models import Video, Note

class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Note
        fields = ['id', 'content', 'timestamp', 'owner', 'video']


class VideoSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    # We are "nesting" the NoteSerializer here.
    # This means when we fetch a video, we'll also get all its notes included.
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'source', 'owner', 'created_at', 'notes']