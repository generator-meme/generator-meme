from django.contrib import admin
from django.db.models import OuterRef, Case, When, Value, Exists
from django.utils.html import format_html

from .models import Meme, TemplateUsedTimes, Tag, Template


class TagsInline(admin.TabularInline):
    """Инлайн для редактирования тегов конкретного шаблона."""
    model = Tag.memes.through
    extra = 3


@admin.register(Meme)
class MemeAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''
    list_display = ('image', 'author', 'template')
    list_filter = ('template',)


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    '''Админ-панель модели Meme с фильтрацией по тегам'''

    def image_tag(self, obj):
        """Форматирование картинки шаблона для вывода в общем списке."""
        return format_html(
            '<img src="{}" width="500" height="450" />'.format(obj.image.url))

    def get_tags(self, obj):
        """Получить строку с тегами для отображения в общем списке шаблонов."""
        return ",  " . join([x.__str__() for x in obj.tag.all()])

    get_tags.short_description = 'Tags'
    image_tag.short_description = 'Image'

    list_display = ('image_tag', 'is_published',
                    'get_tags', 'name')
    fields = ('name', 'image', 'is_published', 'used_times')
    readonly_fields = ('used_times', )
    list_editable = ('name', 'is_published')
    list_filter = ('is_published', 'tag')
    inlines = [
        TagsInline,
    ]
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
                ),
                    then=TemplateUsedTimes.objects.filter(
                        template=OuterRef('pk')
                    ).values('used_times')
                ),
                default=Value(0)
            )
        )

    @admin.display(
        ordering='used_times',
        description='Использовано раз',
    )
    def used_times(self, obj):
        return obj.used_times


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    '''Админ-панель модели Tag с фильтрацией по названию'''
    list_display = ('name', 'slug')
    list_filter = ('name',)
