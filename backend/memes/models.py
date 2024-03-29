from uuid import uuid4

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Tag(models.Model):
    """Модель хэштегов для шаблонов."""

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


class Category(models.Model):
    """Модель категорий шаблонов."""

    @classmethod
    def get_default_id(cls):
        """Возвращает id категории по умолчанию."""
        category, created = cls.objects.get_or_create(
            name='Картинки',
        )
        return category.id

    name = models.CharField(
        verbose_name='Название категории',
        max_length=300,
        unique=True
    )

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ('id',)

    def __str__(self) -> str:
        return self.name


class Template(models.Model):
    """Модель шаблона."""

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
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_DEFAULT,
        related_name='templates',
        default=Category.get_default_id,
    )
    tag = models.ManyToManyField(
        Tag,
        verbose_name='Теги',
        related_name='memes',
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name='Дата загрузки в базу',
        auto_now_add=True)
    published_at = models.DateTimeField(
        verbose_name='Дата публикации на сайт',
        null=True,
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликован'
    )

    def __str__(self) -> str:
        return f'{self.id}'

    class Meta:
        verbose_name = 'Шаблон мема'
        verbose_name_plural = 'Шаблоны мемов'
        ordering = ('-published_at',)


class Meme(models.Model):
    """Модель готового мема."""

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
        ordering = ('-created_at',)


class Favorite(models.Model):
    """Модель избранного шаблона."""

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


class UserCollection(models.Model):
    """Коллекция готовых мемов пользователя."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='collection',
        verbose_name='Пользователь',
    )
    meme = models.ForeignKey(
        Meme,
        on_delete=models.CASCADE,
        related_name='collection',
        verbose_name='Мем',
    )
    added_at = models.DateTimeField(
        verbose_name='Дата добавления',
        auto_now_add=True,
    )
    is_author = models.BooleanField(
        default=False,
        verbose_name='Собственный мем',
    )

    class Meta:
        verbose_name = 'Коллекция мемов'
        verbose_name_plural = 'Коллекции мемов'
        ordering = ('-added_at',)
        constraints = (
            models.UniqueConstraint(
                fields=('user', 'meme'),
                name='unique_user_meme',
            ),
        )
