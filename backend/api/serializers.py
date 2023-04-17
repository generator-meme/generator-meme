from uuid import uuid4

from django.db import transaction
from drf_base64.fields import Base64ImageField
from rest_framework.serializers import (ModelSerializer,
                                        PrimaryKeyRelatedField, UUIDField,
                                        ValidationError)

from memes.models import Favorite, Meme, Tag, Template
from users.serializers import UserSerializer


class TagSerializer(ModelSerializer):
    '''Сериализатор модели Tag'''
    class Meta:
        fields = ('id', 'name', 'slug')
        model = Tag


class TemplateReadSerializer(ModelSerializer):
    '''Сериализатор модели Template для чтения объекта'''
    id = UUIDField(read_only=True, default=uuid4)
    tag = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = '__all__'


class TemplateWriteSerializer(ModelSerializer):
    '''Сериализатор модели Meme для записи объекта'''
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
    '''Сериализатор модели Meme для чтения объекта'''
    id = UUIDField(read_only=True, default=uuid4)
    author = UserSerializer(read_only=True)
    template = TemplateReadSerializer(read_only=True)

    class Meta:
        model = Meme
        fields = '__all__'


class MemeWriteSerializer(ModelSerializer):
    '''Сериализатор модели Meme для записи объекта'''
    id = UUIDField(read_only=True, default=uuid4)
    image = Base64ImageField(
        use_url=True,
        max_length=None
    )
    author = UserSerializer(read_only=True)
    template = PrimaryKeyRelatedField(
        queryset=Template.objects.all(),
        required=False
    )

    class Meta:
        model = Meme
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        '''Проверяет на авторизацию, добавляет автора мема'''
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


class FavoriteSerializer(ModelSerializer):
    '''Сериализатор модели Favorite'''
    id = UUIDField(read_only=True, default=uuid4)

    class Meta:
        fields = '__all__'
        model = Favorite

    def validate(self, data):
        '''Валидирует на наличие шаблона в избранных'''
        request = self.context['request']
        if not request or request.user.is_anonymous:
            return False
        if Favorite.objects.filter(
            user=request.user, template=data.get('template')
        ).exists():
            raise ValidationError(
                {'Favorite_exists_error': 'Шаблон уже в избранном.'}
            )
        return data

    def to_representation(self, instance):
        return TemplateReadSerializer(
            instance.template,
            context={'request': self.context['request']}
        ).data
