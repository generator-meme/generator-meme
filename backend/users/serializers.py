from djoser.serializers import UserSerializer

from .models import User


class UsersSerializer(UserSerializer):

    class Meta:
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
        )
        model = User
