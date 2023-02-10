from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS

from .permissions import AdminOrReadOnly
from .serializers import (FavoriteSerializer, MemeReadSerializer,
                          MemeWriteSerializer, TagSerializer,
                          TemplateReadSerializer, TemplateWriteSerializer)
from .services import additions
from memes.models import Favorite, Meme, Tag, Template


class MemeViewSet(viewsets.ModelViewSet):
    queryset = Meme.objects.all()

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return MemeReadSerializer
        return MemeWriteSerializer

    @method_decorator(cache_page(60))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=True)
    def download_meme(self, request, pk):
        image = get_object_or_404(Meme, pk=pk).image
        if request.user.is_authenticated:
            filename = f'{request.user.username}_meme.jpg'
        else:
            filename = 'personal_meme.jpg'
        response = HttpResponse(image, content_type='image/jpeg')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response


class TemplateViewSet(viewsets.ModelViewSet):
    '''Представление для модели Meme'''
    queryset = Template.objects.all()
    permission_classes = [AdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return TemplateReadSerializer
        return TemplateWriteSerializer

    @action(detail=True)
    def favorite(self, request, pk):
        return additions(request, pk, Favorite, FavoriteSerializer)


class TagViewSet(viewsets.ModelViewSet):
    '''Представление для модели Tag'''
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AdminOrReadOnly]
