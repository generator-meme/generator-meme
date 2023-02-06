from uuid import uuid4

from django.db import transaction
from drf_base64.fields import Base64ImageField
from rest_framework.serializers import (ModelSerializer,
                                        PrimaryKeyRelatedField, UUIDField)

from memes.models import Meme, Tag, Template
from users.serializers import UserSerializer


class TagSerializer(ModelSerializer):
    '''Сериализатор модели Tag'''
    class Meta:
        fields = '__all__'
        model = Tag


class TemplateReadSerializer(ModelSerializer):
    id = UUIDField(read_only=True, default=uuid4)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = '__all__'


class TemplateWriteSerializer(ModelSerializer):
    '''Сериализатор модели Meme'''
    id = UUIDField(read_only=True, default=uuid4)
    image = Base64ImageField(
        use_url=True,
        max_length=None
    )
    tag = PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )

    class Meta:
        model = Template
        fields = '__all__'


class MemeReadSerializer(ModelSerializer):
    id = UUIDField(read_only=True, default=uuid4)
    author = UserSerializer(read_only=True)
    template = TemplateReadSerializer(read_only=True)

    class Meta:
        model = Meme
        fields = '__all__'


class MemeWriteSerializer(ModelSerializer):
    id = UUIDField(read_only=True, default=uuid4)
    image = Base64ImageField(
        use_url=True,
        max_length=None
    )
    author = UserSerializer(read_only=True)
    template = PrimaryKeyRelatedField(queryset=Template.objects.all(), )

    class Meta:
        model = Meme
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return Meme.objects.create(
                author=request.user,
                **validated_data
            )
        return Meme.objects.create(
            **validated_data
        )

    def to_representation(self, instance):
        return MemeReadSerializer(
            instance,
            context={
                'request': self.context.get('request')
            }
        ).data
