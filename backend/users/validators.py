from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class MaximumLengthValidator:
    """Валидатор для поля password на максимальную длину."""

    def __init__(self, max_length=8):
        self.max_length = max_length

    def validate(self, password, user=None):
        """Проверка на максимальную длину."""
        if len(password) > self.max_length:
            raise ValidationError(
                _("Введённый пароль слишком длинный. Он должен содержать "
                  "максимум %(max_length)d символов."),
                code='password_too_large',
                params={'max_length': self.max_length},
            )

    def get_help_text(self):
        """Получение текста дополнительного описания."""
        return _(
            "Введённый пароль слишком длинный. Он должен содержать "
            "максимум %(max_length)d символов."
            % {'max_length': self.max_length}
        )
