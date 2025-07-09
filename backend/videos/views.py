# videos/views.py
from rest_framework import viewsets, permissions
from .models import Video, Note
from .serializers import VideoSerializer, NoteSerializer

class VideoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows videos to be viewed or edited.
    """
    serializer_class = VideoSerializer
    # Only authenticated users can access this viewset.
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures that users can only see their own videos.
        return self.request.user.videos.all().order_by('-created_at')

    def perform_create(self, serializer):
        # This automatically sets the owner of the video to the logged-in user.
        serializer.save(owner=self.request.user)


class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows notes to be viewed or edited.
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures users can only see their own notes.
        return self.request.user.notes.all()

    def perform_create(self, serializer):
        # You must provide the 'video_id' in the request body.
        # The owner is set automatically.
        serializer.save(owner=self.request.user)