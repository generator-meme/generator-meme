from django.shortcuts import get_object_or_404
from rest_framework import serializers

from groups.models import (Group, GroupBannedUser, GroupMeme, GroupRole,
                           GroupUser)
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CurrentUserDefault

from api.serializers_users import UsersSerializer

from api.serializers_memes import TemplateReadSerializer


class GroupUserReadSerializer(serializers.ModelSerializer):
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
    """Сериализатор модели Group."""

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
    """Полный сериализатор группы"""
    owner = UsersSerializer()
    users = GroupUserReadSerializer(source='group_users', many=True,
                                    read_only=True)
    memes = GroupMemeSerializer(source='group_memes', many=True, read_only=True)
    banlist = GroupBannedUserReadSerializer(source='banned_users', many=True,
                                            read_only=True)

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
    """Сериализатор пользователей в группе."""
    role = serializers.PrimaryKeyRelatedField(
        queryset=GroupRole.objects.all(),
        default=GroupRole.objects.get_or_create(name="Пользователь")[0]
    )

    class Meta:
        fields = '__all__'
        read_only_field = ('role',)
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
                {'GroupUser_exists_error': 'Пользователь уже в группе.'}
            )
        elif data.get('group').owner == data.get('user'):
            raise ValidationError(
                {'GroupUser_error': 'Администратора нельзя добавить в список.'}
            )
        elif GroupBannedUser.objects.filter(
                user=data.get('user'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'GroupBannedUser_error':
                 'Пользователь забаннен и не может быть добавлен в группу.'}
            )
        return data

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data


class GroupMemeWriteSerializer(serializers.ModelSerializer):
    """Сериализатор пользователей в группе."""

    class Meta:
        fields = '__all__'
        model = GroupMeme

    def validate(self, data):
        """Валидирует на наличие мема в группе и права."""
        request = self.context['request']
        if not request or request.user.is_anonymous:
            return False
        if GroupMeme.objects.filter(
                meme=data.get('meme'), group=data.get('group')
        ).exists():
            raise ValidationError(
                {'GroupMeme_exists_error': 'Мем уже в группе.'}
            )
        if request.user in data.get('group').users or (
                request.user == data.get('group').owner
        ):
            return data
        raise ValidationError(
            {'GroupMeme_error':
             'Мем может добавить только пользователь группы или админ.'}
        )

    def to_representation(self, instance):
        serializer = GroupFullSerializer(
            instance.group,
            context={'request': self.context.get('request')}
        )
        return serializer.data
