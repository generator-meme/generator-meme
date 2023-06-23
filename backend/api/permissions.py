from rest_framework import permissions


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
    """Разрешение только для владельцев группы."""
    def has_object_permission(self, request, view, obj):
        if request.user == obj.owner:
            return True
        return False
