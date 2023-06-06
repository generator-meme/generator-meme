from django.urls import include, path
from rest_framework import routers

from .views import CategoryViewSet, MemeViewSet, TagViewSet, TemplateViewSet

router = routers.DefaultRouter()
router.register('memes', MemeViewSet, basename='memes')
router.register('templates', TemplateViewSet, basename='templates')
router.register('tags', TagViewSet, basename='tags')
router.register('categories', CategoryViewSet, basename='categories')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/social/', include('social_django.urls', namespace='social'))
]
