from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.html import format_html

from groups.models import Group, GroupRole
from memes.models import Meme

User = get_user_model()


class UsersInline(admin.TabularInline):
    """Инлайн для редактирования участников группы."""

    model = User.meme_groups.through
    extra = 0


class BanlistInline(admin.TabularInline):
    """Инлайн для редактирования банлиста группы."""

    model = User.group_banlist.through
    extra = 0


class MemeInline(admin.TabularInline):
    """Инлайн для редактирования мемов группы."""

    model = Meme.groups.through
    extra = 0


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    """Админ-панель модели Group."""

    @admin.display(description="Редактировать")
    def show_firm_url(self, obj):
        return format_html("<a href='{url}'>Редактировать</a>", url=obj.id)

    fields = (
        'name',
        'description',
        'closed',
        'owner',
        'created_at',
    )
    readonly_fields = (
        'created_at',
    )
    list_display = (
        'id',
        'name',
        'closed',
        'owner',
        'description',
        'created_at',
        'show_firm_url',
    )
    list_editable = (
        'closed',
    )
    list_filter = (
        'closed',
        'owner',
    )
    search_fields = (
        'name',
    )
    inlines = (
        UsersInline,
        BanlistInline,
        MemeInline,
    )
    search_help_text = ('Поиск по названию группы')
    list_per_page = 20


@admin.register(GroupRole)
class GroupRoleAdmin(admin.ModelAdmin):
    """Админ-панель модели GroupRole."""

    @admin.display(description="Редактировать")
    def show_firm_url(self, obj):
        return format_html("<a href='{url}'>Редактировать</a>", url=obj.id)

    fields = (
        'name',
        'is_admin',
        'is_moderator',
    )
    list_display = (
        'id',
        'name',
        'is_admin',
        'is_moderator',
        'show_firm_url',
    )
    list_editable = (
        'is_admin',
        'is_moderator',
    )
    list_filter = (
        'is_admin',
        'is_moderator',
        'name',
    )
    search_fields = (
        'name',
    )
    search_help_text = ('Поиск по названию роли')
    list_per_page = 20
