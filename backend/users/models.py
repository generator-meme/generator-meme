from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole:
    User = 'user'
    Admin = 'admin'
    ROLES = (
        (User, 'Авторизованный пользователь'),
        (Admin, 'Администратор'),
    )


class User(AbstractUser):

    role = models.CharField(
        max_length=16,
        choices=UserRole.ROLES,
        default=UserRole.User
    )
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True, max_length=254)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', ]

    models.UniqueConstraint(fields=['username', 'email'],
                            name='unique_username_email')

    models.UniqueConstraint(fields=['first_name', 'last_name'],
                            name='name')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ('username',)

    def __str__(self):
        return self.username
