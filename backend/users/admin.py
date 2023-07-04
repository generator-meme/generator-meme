from django.contrib import admin
from django.contrib.admin.models import LogEntry, DELETION
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.urls import reverse

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Админ-панель модели User"""

    list_display = (
        'id',
        'username',
        'first_name',
        'last_name',
        'email'
    )
    list_filter = ('email', 'username')


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    """Админ-панель логов действий в админке."""

    date_hierarchy = 'action_time'

    list_filter = [
        'action_flag',
        'content_type',
    ]

    search_fields = [
        'object_repr',
        'change_message',
    ]

    list_display = [
        'action_time',
        'user',
        'action_flag',
        'content_type',
        'object_link',
    ]

    def has_add_permission(self, request):
        """Доступ к созданию нового объекта."""
        return False

    def has_change_permission(self, request, obj=None):
        """Доступ к изменению объекта."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Доступ к удалению объекта."""
        return False

    def has_view_permission(self, request, obj=None):
        """Доступ к просмотру объекта."""
        return request.user.is_superuser

    @admin.display(
            ordering='object_repr',
            description='Объект',
        )
    def object_link(self, obj):
        """Ссылка на объект."""
        if obj.action_flag == DELETION:
            link = escape(obj.object_repr)
        else:
            ct = obj.content_type
            link = '<a href="%s">%s</a>' % (
                reverse(
                    'admin:%s_%s_change' % (ct.app_label, ct.model),
                    args=[obj.object_id]
                ),
                escape(obj.object_repr),
            )
        return mark_safe(link)
