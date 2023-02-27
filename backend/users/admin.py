from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    '''Админ-панель модели User с фильтрацией по почте и имени пользователя'''
    list_display = (
        'id',
        'username',
        'first_name',
        'last_name',
        'email'
    )
    list_filter = ('email', 'username')
