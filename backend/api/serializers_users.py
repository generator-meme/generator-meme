from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer

User = get_user_model()


class UsersSerializer(UserSerializer):
    """Сериализатор модели пользователя."""

    class Meta:
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
        )
        model = User
