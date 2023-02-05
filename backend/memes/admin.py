from django.contrib import admin
from .models import Meme, Template, Tag


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''
    list_display = ('id', 'image', 'author', 'template')
    list_filter = ('template',)


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''
    list_display = ('id', 'image')
    list_filter = ('tag',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('id', 'name', 'slug')
    list_filter = ('name',)
