from django.contrib import admin
from .models import Meme, Tag


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''
    list_display = ('id',)
    list_filter = ('tag',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('name', 'slug')
    list_filter = ('name',)
