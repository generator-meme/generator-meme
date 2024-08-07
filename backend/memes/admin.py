from django.contrib import admin
from django.db import models
from django.db.models import Case, Count, Exists, OuterRef, Q, Value, When
from django.forms import TextInput
from django.utils.html import format_html

from memes.models import (Category, Meme, Tag, Template, TemplateUsedTimes,
                          UserCollection)


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    """Админ-панель модели Meme с фильтрацией по тегам."""

    def image_tag(self, obj):
        """Форматирование картинки мема для вывода в общем списке."""
        return format_html(
            '<img src="{}" width="430" height="380" />'.format(obj.image.url))

    list_display = (
        'image_tag',
        'author',
        'template',
        'created_at',
    )
    list_filter = (
        'author',
    )


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    """Админ-панель модели Template."""

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
    fields = (
        'name',
        'image',
        'category',
        'is_published',
        'tag',
        'used_times',
        'created_at',
        'published_at',
    )
    readonly_fields = (
        'used_times',
        'created_at',
        'published_at',
    )
    list_display = (
        'image_tag',
        'is_published',
        'category',
        'get_tags',
        'name',
    )
    list_editable = (
        'name',
        'category',
        'is_published',
    )
    list_filter = (
        'is_published',
        'category',
        'tag',
    )
    filter_horizontal = (
        'tag',
    )
    search_fields = (
        '=id',
    )
    search_help_text = ('Поиск по идентификатору шаблона (точное совпадение)')
    list_per_page = 50
    actions = [
        'publish',
        'hide',
        'picture_category',
        'comics_category',
    ]
    actions_on_bottom = True

    @admin.action(description='Опубликовать на сайте')
    def publish(self, request, queryset):
        """Публикует выбранные шаблоны мемов"""
        for template in queryset:
            if not template.is_published:
                template.is_published = True
                template.save()

    @admin.action(description='Скрыть на сайте')
    def hide(self, request, queryset):
        """Отменяет публикацию выбранных шаблонов мемов"""
        for template in queryset:
            if template.is_published:
                template.is_published = False
                template.save()

    @admin.action(description='Категория "Картинки"')
    def picture_category(self, request, queryset):
        """Проставляет шаблонам категорию Картинки"""
        queryset.update(
            category=Category.objects.get_or_create(name='Картинки')[0].id
        )

    @admin.action(description='Категория "Комиксы"')
    def comics_category(self, request, queryset):
        """Проставляет шаблонам категорию Комиксы"""
        queryset.update(
            category=Category.objects.get_or_create(name='Комиксы')[0].id
        )

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
    """Админ-панель модели Tag с фильтрацией по названию."""

    list_display = (
        'id',
        'name',
        'slug',
        'templates_use_this',
    )
    list_per_page = 50
    search_fields = (
        'name',
    )
    search_help_text = ('Поиск по имени тега')
    prepopulated_fields = {
        'slug': ('name',)
    }
    actions_on_bottom = True

    def get_queryset(self, request):
        """Получить кверисет. Аннотируется количеством опубликованных
        шаблонов использующих этот тег."""
        tags = Tag.objects.all()
        return tags.annotate(templates_use_this=Count(
            'memes',
            filter=Q(memes__is_published=True)
        ))

    @admin.display(
        description='Используется в шаблонах',
    )
    def templates_use_this(self, obj):
        return obj.templates_use_this


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Админ-панель модели Category."""

    list_display = (
        'id',
        'name',
        'templates_use_this',
    )
    list_per_page = 20
    search_fields = (
        'name',
    )
    search_help_text = ('Поиск по названию категории')
    actions_on_bottom = True

    def get_queryset(self, request):
        """Получить кверисет. Аннотируется количеством опубликованных
        шаблонов использующих эту категорию."""
        categories = Category.objects.all()
        return categories.annotate(templates_use_this=Count(
            'templates',
            filter=Q(templates__is_published=True)
        ))

    @admin.display(
        description='Используется в шаблонах',
    )
    def templates_use_this(self, obj):
        return obj.templates_use_this


@admin.register(UserCollection)
class CollectionAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'meme',
        'added_at',
        'is_author',
    )
    list_editable = (
        'is_author',
        'user',
        'meme',
    )
