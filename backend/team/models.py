from django.db import models


class Teammate(models.Model):
    """Модель участника команды."""

    name = models.CharField(
        verbose_name='Имя',
        max_length=300,
        help_text='Максимум 300 символов',
    )

    description = models.CharField(
        verbose_name='Описание',
        max_length=300,
        blank=True,
        help_text='Максимум 300 символов',
    )

    link = models.CharField(
        verbose_name='Ссылка',
        max_length=300,
        blank=True,
        help_text='Максимум 300 символов',
    )

    active = models.BooleanField(
        verbose_name='Активный',
        default=True,
    )

    class Meta:
        verbose_name = 'Участник'
        verbose_name_plural = 'Участники'
        ordering = ('-active', 'name')

    def __str__(self) -> str:
        return self.name


class TeamGroup(models.Model):
    """Модель групп участников команды."""

    name = models.CharField(
        verbose_name='Название',
        max_length=300,
        help_text='Максимум 300 символов',
    )

    teammates = models.ManyToManyField(
        Teammate,
        verbose_name="Ингредиенты",
        through='GroupTeammate',
        related_name='teammates',
    )

    level = models.IntegerField(
        verbose_name='Уровень',
        help_text=('Чем меньше цифра, тем выше в выводе '
                   'информации будет эта группа'),
    )

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ('level', 'name')

    def __str__(self) -> str:
        return self.name


class GroupTeammate(models.Model):
    """Участники в группе."""

    group = models.ForeignKey(
        TeamGroup,
        on_delete=models.CASCADE,
        related_name='groups',
    )
    teammate = models.ForeignKey(
        Teammate,
        on_delete=models.CASCADE,
        related_name='teammate',
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('group', 'teammate'),
                name='unique_group_teammate',
            ),
        )

    def __str__(self):
        return f"{self.teammate} в группе {self.group}"
