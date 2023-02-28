from django.contrib import admin
from django.utils.html import format_html

from .models import Meme, Tag, Template


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''
    list_display = ('image', 'author', 'template')
    list_filter = ('template',)


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''

    def image_tag(self, obj):
        return format_html(
            '<img src="{}" width="150" height="100" />'.format(obj.image.url))

    image_tag.short_description = 'Image'
    list_display = ('image_tag', 'is_published', 'name')
    list_filter = ('tag',)
    actions = ['publish', 'hide']

    @admin.action(description='Добавить на сайт выбранные шаблоны')
    def publish(self, request, queryset):
        '''Публикует выбранные шаблоны мемов'''
        queryset.update(is_published=True)

    @admin.action(description='Убрать с сайта выбранные шаблоны')
    def hide(self, request, queryset):
        '''Публикует выбранные шаблоны мемов'''
        queryset.update(is_published=False)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('name', 'slug')
    list_filter = ('name',)
