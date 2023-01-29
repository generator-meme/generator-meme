from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS

from .permissions import AdminOrReadOnly
from .serializers import (
    TagSerializer, TemplateReadSerializer, TemplateWriteSerializer
)
from memes.models import Template, Tag


class TemplateViewSet(viewsets.ModelViewSet):
    '''Представление для модели Meme'''
    queryset = Template.objects.all()
    permission_classes = [AdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return TemplateReadSerializer
        return TemplateWriteSerializer


class TagViewSet(viewsets.ModelViewSet):
    '''Представление для модели Tag'''
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AdminOrReadOnly]
