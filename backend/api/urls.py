from django.urls import include, path
from rest_framework import routers

from api.views_groups import GroupViewSet, UserGroupsViewSet
from api.views_memes import (CategoryViewSet, MemeViewSet, TagViewSet,
                             TemplateViewSet)
from api.views_team import TeamGroupViewSet

router = routers.DefaultRouter()
router.register('memes', MemeViewSet, basename='memes')
router.register('templates', TemplateViewSet, basename='templates')
router.register('tags', TagViewSet, basename='tags')
router.register('categories', CategoryViewSet, basename='categories')
router.register('team', TeamGroupViewSet, basename='team')
router.register('groups', GroupViewSet, basename='group')
router.register('users/mygroups', UserGroupsViewSet, basename='mygroups')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/social/', include('social_django.urls', namespace='social'))
]
