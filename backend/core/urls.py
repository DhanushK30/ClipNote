# core/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter 
from videos import views as video_views 


router = DefaultRouter()
router.register(r'videos', video_views.VideoViewSet, basename='video')
router.register(r'notes', video_views.NoteViewSet, basename='note')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('users.urls')),
    path('api/', include(router.urls)),
]