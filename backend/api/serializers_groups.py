from rest_framework import serializers

from groups.models import Group, GroupBannedUser, GroupMeme, GroupUser

from .serializers_users import UsersSerializer


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
    author = serializers.ReadOnlyField(source='meme.author')
    image = serializers.ImageField(source='meme.image', read_only=True)
    created_at = serializers.ReadOnlyField(source='meme.created_at')

    class Meta:
        fields = (
            'id',
            'author',
            'image',
            'created_at',
            'added_at'
        )
        model = GroupMeme


class GroupBannedUserSerializer(serializers.ModelSerializer):
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
    users = GroupUserReadSerializer(source='group_users', many=True, read_only=True)
    memes = GroupMemeSerializer(source='group_memes', many=True, read_only=True)
    banlist = GroupBannedUserSerializer(source='banned_users', many=True, read_only=True)

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
        model = Group
