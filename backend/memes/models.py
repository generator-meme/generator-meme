from django.db import models


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


class Meme(models.Model):
    image = models.ImageField(
        verbose_name='Шаблон мема',
        upload_to='meme/images'
    )
    tag = models.ManyToManyField(
        Tag,
        verbose_name='теги',
        related_name='memes'
    )

    class Meta:
        verbose_name = 'Мем'
        verbose_name_plural = 'Мемы'
