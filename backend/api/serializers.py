from drf_base64.fields import Base64ImageField
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from memes.models import Tag, Template


class TagSerializer(ModelSerializer):
    '''Сериализатор модели Tag'''
    class Meta:
        fields = '__all__'
        model = Tag


class TemplateReadSerializer(ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Template
        fields = '__all__'


class TemplateWriteSerializer(ModelSerializer):
    '''Сериализатор модели Meme'''
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
