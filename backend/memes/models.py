from uuid import uuid4

from django.db import models
from django.db.models import Count, F

from users.models import User


class Tag(models.Model):
    """Модель хэштегов"""
    name = models.CharField(
        verbose_name='Название тега',
        max_length=150,
        unique=True
    )
    slug = models.SlugField(
        verbose_name='Slug тега',
        unique=True,
        db_index=True
    )

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ('name',)

    def __str__(self) -> str:
        return self.name


class Template(models.Model):
    """Модель шаблона"""
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(
        verbose_name='Название шаблона',
        max_length=100,
        null=True,
        blank=True
    )
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to='meme/template_images'
    )
    tag = models.ManyToManyField(
        Tag,
        verbose_name='Теги',
        related_name='memes',
        blank=True
    )
    created_at = models.DateTimeField(
        verbose_name='Дата публикации',
        auto_now_add=True)
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликован'
    )

    class Meta:
        verbose_name = 'Шаблон мема'
        verbose_name_plural = 'Шаблоны мемов'
        ordering = ('-created_at',)


class Meme(models.Model):
    """Модель готового мема пользователя"""
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to='meme/memes_images'
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.SET_NULL,
        related_name='memes',
        null=True,
        blank=True
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        verbose_name='Дата публикации',
        auto_now_add=True)

    class Meta:
        verbose_name = 'Готовый мем'
        verbose_name_plural = 'Готовые мемы'


class Favorite(models.Model):
    """Модель избранного шаблона"""
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='follower',
        verbose_name='Пользователь'
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.CASCADE,
        related_name='favorite',
        verbose_name='Избранный шаблон'
    )

    class Meta:
        ordering = ('user',)
        constraints = [
            models.UniqueConstraint(
                fields=('user', 'template'),
                name='favorite_template'
            )
        ]
        verbose_name = 'Избранный шаблон'
        verbose_name_plural = 'Избранные шаблоны'

    def __str__(self):
        return f'{self.template} - избранный шаблон для: {self.user}'


class TemplateUsedTimes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    template = models.ForeignKey(
        Template,
        on_delete=models.CASCADE,
        related_name='template_used_times',
        verbose_name='Использован раз'
    )
    used_times = models.IntegerField(default=0)
