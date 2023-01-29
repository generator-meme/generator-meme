from django.urls import include, path
from rest_framework import routers

from .views import TemplateViewSet, TagViewSet

router = routers.DefaultRouter()
router.register('memes', TemplateViewSet, basename='memes')
router.register('tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
]
