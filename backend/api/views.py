from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS

from .permissions import AdminOrReadOnly
from .serializers import MemeReadSerializer, MemeWriteSerializer, TagSerializer
from memes.models import Meme, Tag


class MemeViewSet(viewsets.ModelViewSet):
    '''Представление для модели Meme'''
    queryset = Meme.objects.all()
    permission_classes = [AdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return MemeReadSerializer
        return MemeWriteSerializer


class TagViewSet(viewsets.ModelViewSet):
    '''Представление для модели Tag'''
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AdminOrReadOnly]
