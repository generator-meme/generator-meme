from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CurrentUserDefault, SerializerMethodField

from api.serializers_memes import TemplateReadSerializer
from api.serializers_users import UsersSerializer
from groups.models import (Group, GroupBannedUser, GroupMeme, GroupRole,
                           GroupUser)

User = get_user_model()


class GroupUserReadSerializer(serializers.ModelSerializer):
    """Сериализатор юзеров в группе (чтение)."""

    id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'added_at',
            'role'
        )
        model = GroupUser


class GroupSerializer(serializers.ModelSerializer):
    """Сериализатор модели Group (чтение)."""

    class Meta:
        fields = (
            'id',
            'name',
            'description',
            'created_at',
            'closed',
            'owner'
        )
        read_only_fields = (
            'created_at',
            'closed',
            'owner'
        )
        model = Group


class GroupMemeSerializer(serializers.ModelSerializer):
    """Сериализатор готового мема в группе (чтение)."""

    id = serializers.ReadOnlyField(source='meme.id')
    author = serializers.SerializerMethodField(source='meme.author')
    image = serializers.ImageField(source='meme.image', read_only=True)
    added_by = UsersSerializer(read_only=True)
    created_at = serializers.ReadOnlyField(source='meme.created_at')
    template = serializers.SerializerMethodField(source='meme.template')

    class Meta:
        fields = (
            'id',
            'author',
            'image',
            'created_at',
            'added_by',
            'added_at',
            'template'
        )
        model = GroupMeme

    def get_author(self, obj):
        author = obj.meme.author
        if author is None:
            return None
        serializer = UsersSerializer(read_only=True, instance=author)
        return serializer.data

    def get_template(self, obj):
        template = obj.meme.template
        if template is None:
            return None
        serializer = TemplateReadSerializer(read_only=True, instance=template)
        return serializer.data


class GroupBannedUserReadSerializer(serializers.ModelSerializer):
    """Сериализатор пользователей в банлисте группы (чтение)."""

    id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'baned_at',
        )
        model = GroupBannedUser


class GroupFullSerializer(serializers.ModelSerializer):
    """Полный сериализатор группы."""

    owner = UsersSerializer()
    users = GroupUserReadSerializer(
        source='group_users',
        many=True,
        read_only=True,
    )
    memes = GroupMemeSerializer(
        source='group_memes',
        many=True,
        read_only=True,
    )
    banlist = GroupBannedUserReadSerializer(
        source='banned_users',
        many=True,
        read_only=True,
    )

    class Meta:
        fields = (
            'id',
            'name',
            'description',
            'created_at',
            'closed',
            'owner',
            'users',
            'memes',
            'banlist'
        )
        read_only_fields = (
            'id',
            'created_at',
            'closed',
            'owner',
            'users',
            'memes',
            'banlist'
        )
        model = Group


class GroupWriteSerializer(serializers.ModelSerializer):
    """Сериализатор модели Group (запись)."""

    owner = UsersSerializer(read_only=True, default=CurrentUserDefault())

    class Meta:
        fields = (
            'name',
            'description',
            'owner',
            'closed',
        )
        read_only_fields = (
            'owner',
        )
        model = Group

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class GroupUserSerializer(serializers.ModelSerializer):
    """Сериализатор пользователей в группе (запись)."""

    class Meta:
        fields = ('id',
                  'group',
                  'user',
                  'added_at',
                  'role')
        read_only_field = ('id',
                           'group',
                           'added_at',
                           'role',)
        model = GroupUser

    def validate(self, data):
        """Валидирует на наличие пользователя в группе."""
        request = self.context['request']
        if not request or request.user.is_anonymous:
            return False
        if GroupUser.objects.filter(
                user=data.get('user'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'user': 'Пользователь уже в группе.'}
            )
        if GroupBannedUser.objects.filter(
                user=data.get('user'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'user':
                 'Пользователь забаннен и не может быть добавлен в группу.'}
            )
        return data

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class EnterGroupSerializer(serializers.ModelSerializer):
    """Сериализатор пользователей в группе (самостоятельный вход в группу)."""

    class Meta:
        fields = ('id',
                  'group',
                  'user',
                  'added_at',
                  'role')
        read_only_field = ('id',
                           'group',
                           'user',
                           'added_at',
                           'role')
        model = GroupUser

    def validate(self, data):
        """Валидирует на наличие пользователя в группе."""
        request = self.context['request']
        if not request or request.user.is_anonymous:
            return False
        if GroupUser.objects.filter(
                user=data.get('user'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'user': 'Вы уже в группе.'}
            )
        if GroupBannedUser.objects.filter(
                user=data.get('user'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'user':
                 'Вы забаннены и не можете вступить в группу. '
                 'Обратитесь к Администраторам группы'}
            )
        return data

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class GroupBannedUserSerializer(serializers.ModelSerializer):
    """Сериализатор пользователей в банлисте группы (запись)."""

    class Meta:
        fields = (
            'group',
            'user',
        )
        model = GroupBannedUser

    def validate(self, data):
        """Валидирует на наличие пользователя в группе."""
        request = self.context['request']

        if not GroupUser.objects.filter(
                group=data.get('group'),
                user=data.get('user')
        ).exists():
            raise ValidationError(
                {'user': 'Такого пользователя нет в группе.'}
            )
        group_user = GroupUser.objects.get(
            group=data.get('group'),
            user=data.get('user')
        )
        if request.user != group_user.group.owner and group_user.role.is_admin:
            raise ValidationError(
                {'user':
                 'Пользователя со статусом "Администратор" добавить '
                 'в бан может только владелец группы.'}
            )
        if group_user.user == request.user:
            raise ValidationError(
                {'user':
                 'Себя нельзя добавить в бан.'}
            )
        return data

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class GroupMemeWriteSerializer(serializers.ModelSerializer):
    """Сериализатор готового мема в группе (запись)."""

    class Meta:
        fields = (
            'group',
            'added_by',
            'meme',
        )

        model = GroupMeme

    def validate(self, data):
        """Валидирует на наличие мема в группе."""

        if GroupMeme.objects.filter(
                meme=data.get('meme'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'meme': 'Мем уже в группе.'}
            )
        return data

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class GroupUserDeleteSerializer(serializers.Serializer):
    user = serializers.ReadOnlyField()
    group = serializers.ReadOnlyField()

    def validate(self, data):
        request = self.context['request']
        if not request or request.user.is_anonymous:
            return False
        group_user = GroupUser.objects.filter(
            user=self.context['user'],
            group=self.context['group']
        )
        if not group_user.exists():
            raise ValidationError(
                {'user':
                 'Данного пользователя нет в группе.'}
            )
        if (request.user != group_user[0].user
                and group_user[0].role.is_admin
                and request.user != group_user[0].owner):
            raise ValidationError(
                {"user":
                 "Пользователя со статусом 'Администратор' может "
                 "удалить только владелец группы."},
            )
        if request.user == group_user[0].group.owner and (
                group_user[0].user == group_user[0].group.owner):
            raise ValidationError(
                {"user":
                 "Владелец группы не может удалить себя из списка "
                 "пользователей. Вначале передайте группу другому "
                 "пользователю!"}
            )
        return data


class GroupMemeDeleteSerializer(serializers.ModelSerializer):
    """Сериализатор готового мема в группе (удаление)."""

    class Meta:
        fields = (
            'group',
            'meme',
        )
        model = GroupMeme

    def validate(self, data):
        """Валидирует на наличие мема в группе."""
        if not GroupMeme.objects.filter(
            meme=data.get('meme'),
            group=data.get('group'),
        ).exists():
            raise ValidationError(
                {'meme': 'Данного мема нет в группе.'}
            )
        return data


class NewOwnerSerializer(serializers.Serializer):
    """Сериализатор данных при смене владельца группы."""

    user_id = serializers.IntegerField()

    def validate(self, data):
        """Валидирует данные по новому владельцу группы."""
        current_group = self.context['current_group']
        current_user_id = self.context['current_user_id']
        new_owner_id = self.context['new_owner_id']

        if current_user_id == new_owner_id:
            raise ValidationError(
                {'user_id': 'Вы уже являетесь владельцем этой группы.'}
            )
        if not User.objects.filter(id=new_owner_id).exists():
            raise ValidationError(
                {'user_id': 'Пользователя с таким ID не существует.'}
            )
        if not GroupUser.objects.filter(group=current_group,
                                        user_id=new_owner_id).exists():
            raise ValidationError(
                {'user_id': 'Новый владелец не состоит в этой группе.'}
            )
        return data


class ChangeRoleSerializer(serializers.Serializer):
    """Сериализатор данных при установке роли участнику группы."""

    user_id = serializers.IntegerField()
    role_id = serializers.IntegerField()

    def validate(self, data):
        """Валидирует данные."""
        user_id = self.context['user_id']
        role_id = self.context['role_id']
        user_in_group = self.context['user_in_group']

        if not User.objects.filter(id=user_id).exists():
            raise ValidationError(
                {'user_id': 'Пользователя с таким ID не существует.'}
            )
        if not GroupRole.objects.filter(id=role_id).exists():
            raise ValidationError(
                {'role_id': 'Роли с таким ID не существует.'}
            )
        if not user_in_group.exists():
            raise ValidationError(
                {'user_id': 'Пользователь не является участником группы.'}
            )
        if user_in_group[0].role.id == role_id:
            raise ValidationError(
                {'role_id': 'Эта роль уже установлена у пользователя.'}
            )
        return data


class GroupRoleSerializer(serializers.ModelSerializer):
    """Сериализатор ролей в группах мемов."""

    class Meta:
        fields = (
            'name',
            'is_admin',
            'is_moderator',
        )
        model = GroupRole


class UserGroupReadSerializer(serializers.ModelSerializer):
    """Сериализатор групп пользователя (чтение)."""

    group = GroupSerializer()
    role = GroupRoleSerializer()
    is_owner = SerializerMethodField()

    class Meta:
        fields = (
            'group',
            'added_at',
            'role',
            'is_owner',
        )
        model = GroupUser

    def get_is_owner(self, obj):
        """Проверяет, является ли пользователь владельцем группы."""
        return self.context['request'].user == obj.group.owner
