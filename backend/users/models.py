from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinLengthValidator
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
        verbose_name='Роль пользователя',
        max_length=16,
        choices=UserRole.ROLES,
        default=UserRole.User,
    )
    username = models.CharField(
        verbose_name='Имя пользователя',
        max_length=50,
        unique=True,
        validators=[
            MinLengthValidator(
                limit_value=4,
            ),
            RegexValidator(
                regex=r"^[a-zA-Zа-яА-ЯёЁ0-9 !@#$%^&*()\-=\+]+$",
                message='Поле должно содержать только допустимые символы',
            ),
        ],
    )
    email = models.EmailField(
        verbose_name='Электронная почта',
        db_index=True,
        unique=True,
        max_length=254,
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', ]

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ('username',)

    def __str__(self):
        return self.username
