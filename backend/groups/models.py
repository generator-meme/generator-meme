from django.contrib.auth import get_user_model
from django.db import models

from memes.models import Meme

User = get_user_model()


class Group(models.Model):
    """Модель группы с мемами."""

    name = models.CharField(
        verbose_name='Название',
        max_length=300,
        help_text='Максимум 300 символов',
        unique=True,
    )

    description = models.TextField(
        verbose_name='Описание',
        max_length=500,
        blank=True,
        help_text='Максимум 500 символов',
    )

    created_at = models.DateTimeField(
        verbose_name='Дата создания',
        auto_now_add=True
    )

    closed = models.BooleanField(
        verbose_name='Закрытая',
        default=False,
    )

    users = models.ManyToManyField(
        User,
        verbose_name="Участники группы",
        through='GroupUser',
        related_name='meme_groups',
    )

    memes = models.ManyToManyField(
        Meme,
        verbose_name="Мемы группы",
        through='GroupMeme',
        related_name='groups',
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='group_owner',
        verbose_name="Владелец группы",
    )

    banlist = models.ManyToManyField(
        User,
        verbose_name="Банлист группы",
        through='GroupBannedUser',
        related_name='group_banlist',
    )

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ('name', )

    def __str__(self) -> str:
        return self.name


class GroupMeme(models.Model):
    """Модель готового мема в группе."""

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='group_memes',
    )
    meme = models.ForeignKey(
        Meme,
        on_delete=models.CASCADE,
        related_name='meme_groups',
    )
    added_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='group_meme_added_by'
    )

    added_at = models.DateTimeField(
        verbose_name='Дата добавления мема в группу',
        auto_now_add=True
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('group', 'meme'),
                name='unique_group_meme',
            ),
        )


class GroupRole(models.Model):
    """Модель роли в группе."""

    @classmethod
    def get_default_role(cls):
        """Возвращает id роли по умолчанию."""
        category, created = cls.objects.get_or_create(
            name='Пользователь',
            is_admin=False,
            is_moderator=False,
        )
        return category.id

    name = models.CharField(
        verbose_name='Название роли',
        max_length=100,
        help_text='Максимум 100 символов',
        unique=True,
    )

    is_admin = models.BooleanField(
        verbose_name='Уровень администратора',
        default=False,
    )

    is_moderator = models.BooleanField(
        verbose_name='Уровень модератора',
        default=False,
    )

    class Meta:
        verbose_name = 'Роль в группе'
        verbose_name_plural = 'Роли в группе'
        ordering = ('name', )

    def __str__(self) -> str:
        return self.name


class GroupUser(models.Model):
    """Модель участника группы."""

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='group_users',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_groups',
    )

    added_at = models.DateTimeField(
        verbose_name='Дата вступления в группу',
        auto_now_add=True
    )

    role = models.ForeignKey(
        GroupRole,
        on_delete=models.SET_DEFAULT,
        related_name='users',
        default=GroupRole.get_default_role,
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('group', 'user'),
                name='unique_group_user',
            ),
        )


class GroupBannedUser(models.Model):
    """Модель банлиста группы."""

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='banned_users',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='banned_groups',
    )

    baned_at = models.DateTimeField(
        verbose_name='Дата бана в группе',
        auto_now_add=True
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('group', 'user'),
                name='unique_group_user_ban',
            ),
        )
