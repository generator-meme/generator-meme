from uuid import uuid4

from django.db import transaction
from drf_base64.fields import Base64ImageField
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import (BooleanField, ModelSerializer,
                                        PrimaryKeyRelatedField, UUIDField,
                                        ValidationError)

from api.serializers_users import UsersSerializer
from memes.models import (Category, Favorite, Meme, Tag, Template,
                          TemplateUsedTimes)


class TagSerializer(ModelSerializer):
    """Сериализатор модели Tag."""

    class Meta:
        fields = (
            'id',
            'name',
            'slug',
        )
        model = Tag


class CategorySerializer(ModelSerializer):
    """Сериализатор модели Category."""

    class Meta:
        fields = (
            'id',
            'name',
        )
        model = Category


class TemplateReadSerializer(ModelSerializer):
    """Сериализатор модели Template для чтения объекта."""

    id = UUIDField(read_only=True, default=uuid4)
    tag = TagSerializer(many=True, read_only=True)
    used_times = SerializerMethodField()
    is_favorited = BooleanField(read_only=True)
    category = CategorySerializer(read_only=True,)

    class Meta:
        model = Template
        fields = (
            'id',
            'name',
            'image',
            'category',
            'tag',
            'created_at',
            'is_published',
            'is_favorited',
            'used_times',
        )

    def get_used_times(self, obj):
        if TemplateUsedTimes.objects.filter(
            template=obj
        ).exists():
            return TemplateUsedTimes.objects.get(
                template=obj
            ).used_times
        return 0


class TemplateWriteSerializer(ModelSerializer):
    """Сериализатор модели Template для записи объекта."""

    id = UUIDField(read_only=True, default=uuid4)
    image = Base64ImageField(
        use_url=True,
        max_length=None
    )

    class Meta:
        model = Template
        fields = '__all__'


class MemeReadSerializer(ModelSerializer):
    """Сериализатор модели Meme для чтения объекта."""

    id = UUIDField(read_only=True, default=uuid4)
    author = UsersSerializer(read_only=True)

    class Meta:
        model = Meme
        fields = '__all__'


class MemeWriteSerializer(ModelSerializer):
    """Сериализатор модели Meme для записи объекта."""

    id = UUIDField(read_only=True, default=uuid4)
    image = Base64ImageField(
        use_url=True,
        max_length=None
    )
    author = UsersSerializer(read_only=True)
    template = PrimaryKeyRelatedField(
        queryset=Template.objects.all(),
        required=False
    )

    class Meta:
        model = Meme
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        """Проверяет на авторизацию, добавляет автора мема."""
        if validated_data.get('template'):
            template = validated_data['template']
            obj, _ = TemplateUsedTimes.objects.get_or_create(template=template)
            obj.used_times += 1
            obj.save()
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
    """Сериализатор модели Favorite."""

    id = UUIDField(read_only=True, default=uuid4)

    class Meta:
        fields = '__all__'
        model = Favorite

    def validate(self, data):
        """Валидирует на наличие шаблона в избранных."""
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
