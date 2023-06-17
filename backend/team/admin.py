from django.contrib import admin
from django.utils.html import format_html

from team.models import TeamGroup, Teammate


class TeammateInline(admin.TabularInline):
    """Инлайн для редактирования участников группы."""

    model = TeamGroup.teammates.through
    extra = 3


@admin.register(TeamGroup)
class GroupAdmin(admin.ModelAdmin):
    """Админ-панель модели Group."""

    @admin.display(description="Участники")
    def get_teammates(self, obj):
        """Получить строку с участниками гуппы."""
        return ",  " . join([x.__str__() for x in obj.teammates.all()])

    @admin.display(description="Редактировать")
    def show_firm_url(self, obj):
        return format_html("<a href='{url}'>Редактировать</a>", url=obj.id)

    fields = (
        'name',
        'level',
    )
    list_display = (
        'id',
        'name',
        'get_teammates',
        'level',
        'show_firm_url',
    )
    list_editable = (
        'level',
    )
    list_filter = (
        'teammates',
    )
    search_fields = (
        'name',
    )
    inlines = (
        TeammateInline,
    )
    search_help_text = ('Поиск по названию группы')
    list_per_page = 10


@admin.register(Teammate)
class TeammateAdmin(admin.ModelAdmin):
    """Админ-панель модели Teammate."""

    @admin.display(description="Редактировать")
    def show_firm_url(self, obj):
        return format_html("<a href='{url}'>Редактировать</a>", url=obj.id)

    fields = (
        'name',
        'active',
        'description',
        'link',
    )
    list_display = (
        'id',
        'name',
        'active',
        'description',
        'link',
        'show_firm_url',
    )
    list_editable = (
        'active',
    )
    list_filter = (
        'active',
        'name',
    )
    search_fields = (
        'name',
    )
    search_help_text = ('Поиск по имени')
    list_per_page = 25
