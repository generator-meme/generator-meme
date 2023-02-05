from django.db import models
from uuid import uuid4

from users.models import User


class Tag(models.Model):
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

    def __str__(self) -> str:
        return self.slug


class Template(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to='meme/template_images'
    )
    tag = models.ManyToManyField(
        Tag,
        verbose_name='теги',
        related_name='memes',
        blank=True
    )

    class Meta:
        verbose_name = 'Шаблон мема'
        verbose_name_plural = 'Шаблоны мемов'


class Meme(models.Model):
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
