from rest_framework import permissions

from groups.models import GroupUser


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
            return (user_in_group[0].role.is_admin or
                    user_in_group[0].role.is_moderator)
        return False


class IsInGroup(permissions.BasePermission):
    """Разрешение только для участников группы."""

    message = "Вы не являетесь участником этой группы."

    def has_object_permission(self, request, view, obj):
        if GroupUser.objects.filter(group=obj,
                                    user=request.user).exists():
            return True
        return False
