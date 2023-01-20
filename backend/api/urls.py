from django.urls import include, path
from rest_framework import routers

from .views import MemeViewSet, TagViewSet

router = routers.DefaultRouter()
router.register('memes', MemeViewSet, basename='memes')
router.register('tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
]
