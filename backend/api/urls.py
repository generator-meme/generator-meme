from django.urls import include, path
from djoser.views import UserViewSet
from rest_framework import routers

from api import view_token
from api.views_groups import GroupRoleViewSet, GroupViewSet, UserGroupsViewSet
from api.views_memes import (CategoryViewSet, CollectionViewSet, MemeViewSet,
                             TagViewSet, TemplateViewSet)
from api.views_team import TeamGroupViewSet

router = routers.DefaultRouter()
router.register('memes/my-collection', CollectionViewSet,
                basename='collection')
router.register('memes', MemeViewSet, basename='memes')
router.register('templates', TemplateViewSet, basename='templates')
router.register('tags', TagViewSet, basename='tags')
router.register('categories', CategoryViewSet, basename='categories')
router.register('team', TeamGroupViewSet, basename='team')
router.register('groups/roles', GroupRoleViewSet, basename='group_roles')
router.register('groups', GroupViewSet, basename='group')
router.register('users/mygroups', UserGroupsViewSet, basename='mygroups')

user_router = routers.DefaultRouter()
user_router.register(r"auth/users", UserViewSet, basename="users")


def is_route_selected(url_pattern):
    urls = [
        "auth/users/set_email/",
        "auth/users/reset_email/",
        "auth/users/reset_email_confirm/",
    ]

    for u in urls:
        match = url_pattern.resolve(u)
        if match:
            return False
    return True


selected_user_routes = list(filter(is_route_selected, user_router.urls))

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/social/token', view_token.set_token, name='set_token'),
    path('auth/social/', include('social_django.urls', namespace='social'))
] + selected_user_routes
