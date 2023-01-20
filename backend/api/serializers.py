from drf_base64.fields import Base64ImageField
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from memes.models import Meme, Tag


class TagSerializer(ModelSerializer):
    '''Сериализатор модели Tag'''
    class Meta:
        fields = '__all__'
        model = Tag


class MemeReadSerializer(ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Meme
        fields = '__all__'


class MemeWriteSerializer(ModelSerializer):
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
        model = Meme
        fields = '__all__'
