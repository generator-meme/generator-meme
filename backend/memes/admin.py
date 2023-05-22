from django.contrib import admin
from django.db import models
from django.db.models import Case, Exists, OuterRef, Value, When
from django.forms import TextInput
from django.utils.html import format_html

from .models import Meme, Tag, Template, TemplateUsedTimes


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    """Админ-панель модели Meme с фильтрацией по тегам."""

    def image_tag(self, obj):
        """Форматирование картинки мема для вывода в общем списке."""
        return format_html(
            '<img src="{}" width="430" height="380" />'.format(obj.image.url))
    
    list_display = ('image_tag', 'author', 'template', 'created_at')
    list_filter = ('author',)


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''

    def image_tag(self, obj):
        """Форматирование картинки шаблона для вывода в общем списке."""
        return format_html(
            '<img src="{}" width="430" height="380" />'.format(obj.image.url))

    def get_tags(self, obj):
        """Получить строку с тегами для отображения в общем списке шаблонов."""
        return ",  " . join([x.__str__() for x in obj.tag.all()])

    get_tags.short_description = 'Tags'
    image_tag.short_description = 'Image'

    formfield_overrides = {
        models.CharField: {'widget': TextInput(attrs={'size': '30'})},
    }
    fields = ('name', 'image', 'is_published', 'tag', 'used_times')
    readonly_fields = ('used_times', )
    list_display = ('image_tag', 'is_published', 'get_tags', 'name')
    list_editable = ('name', 'is_published',)

    list_filter = ('is_published', 'tag')
    filter_horizontal = ('tag', )
    search_fields = ('=id',)
    search_help_text = ('Поиск по идентификатору шаблона (точное совпадение)')
    list_per_page = 10
    actions = ['publish', 'hide']
    actions_on_bottom = True

    @admin.action(description='Добавить на сайт выбранные шаблоны')
    def publish(self, request, queryset):
        '''Публикует выбранные шаблоны мемов'''
        queryset.update(is_published=True)

    @admin.action(description='Убрать с сайта выбранные шаблоны')
    def hide(self, request, queryset):
        '''Отменяет публикацию выбранных шаблонов мемов'''
        queryset.update(is_published=False)

    def get_queryset(self, request):
        return Template.objects.annotate(
            used_times=Case(
                When(Exists(
                    TemplateUsedTimes.objects.filter(
                        template=OuterRef('pk')
                    )
                ), then=TemplateUsedTimes.objects.filter(
                    template=OuterRef('pk')
                ).values('used_times')),
                default=Value(0)
            )
        )

    @admin.display(
        ordering='used_times',
        description='Использовано раз',
    )
    def used_times(self, obj):
        return obj.used_times

    class Media:
        css = {
            'all': ('admin/css/resize_widget.css',),
        }


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('name', 'slug')
    list_per_page = 50
    search_fields = ('name',)
    search_help_text = ('Поиск по имени тега')
    prepopulated_fields = {'slug': ('name',)}
    actions_on_bottom = True
