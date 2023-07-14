from django.shortcuts import get_object_or_404
from rest_framework import permissions

from groups.models import GroupMeme, GroupUser
from memes.models import Meme


class AdminOrReadOnly(permissions.BasePermission):
    '''Разрешает изменение админу, чтение всем'''
    # прописал пока только суперпользователя,
    # после появления User добавим роль админа
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_anonymous:
            return False
        if request.user.is_superuser:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_superuser:
            return True
        return False


class IsGroupOwner(permissions.BasePermission):
    """Разрешение только для владельца группы."""

    message = "Вы не являетесь владельцем этой группы."

    def has_object_permission(self, request, view, obj):
        if request.user == obj.owner:
            return True
        return False


class IsGroupAdmin(permissions.BasePermission):
    """Разрешение только для админа группы."""

    message = "Вы не являетесь администратором этой группы."

    def has_object_permission(self, request, view, obj):
        user_in_group = GroupUser.objects.filter(
            group=obj,
            user=request.user
        )
        if user_in_group.exists():
            return user_in_group[0].role.is_admin
        return False


class IsGroupAdminOrModer(permissions.BasePermission):
    """Разрешение для админа или модератора группы."""

    message = ("Вы не являетесь администратором "
               "или модератором этой группы.")

    def has_object_permission(self, request, view, obj):
        user_in_group = GroupUser.objects.filter(
            group=obj,
            user=request.user
        )
        if user_in_group.exists():
            return (user_in_group[0].role.is_admin
                    or user_in_group[0].role.is_moderator)
        return False


class IsInGroup(permissions.BasePermission):
    """Разрешение только для участников группы."""

    message = "Вы не являетесь участником этой группы."

    def has_object_permission(self, request, view, obj):
        if GroupUser.objects.filter(group=obj,
                                    user=request.user).exists():
            return True
        return False


class IsGroupAdminOrMemeAddedBy(permissions.BasePermission):
    """Разрешение только для админа или
    пользователя который добавил мем."""

    message = "У вас нет прав для действий с этим мемом."

    def has_object_permission(self, request, view, obj):
        action_model = get_object_or_404(
            GroupMeme,
            meme=get_object_or_404(Meme, id=request.data.get('meme')),
            group=obj,
        )
        if request.user == action_model.added_by:
            return True
        group_user = GroupUser.objects.filter(
            group=obj,
            user=request.user
        )
        if group_user.exists() and group_user[0].role.is_admin:
            return True
        return False
