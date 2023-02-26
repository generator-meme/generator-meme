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
    list_display = ('id', 'image_tag')
    list_filter = ('tag',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('id', 'name', 'slug')
    list_filter = ('name',)
