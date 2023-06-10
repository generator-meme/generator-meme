from django.db.models import Case, Count, Exists, OuterRef, Q, Value, When
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import SAFE_METHODS

from api.filters import TagSearchFilter, TemplateFilter
from api.permissions import AdminOrReadOnly
from api.serializers_memes import (Category, CategorySerializer,
                                   FavoriteSerializer, MemeReadSerializer,
                                   MemeWriteSerializer, TagSerializer,
                                   TemplateReadSerializer,
                                   TemplateWriteSerializer)
from api.services import create_delete_relation
from api.viewsets import ListRetriveViewSet
from memes.models import Favorite, Meme, Tag, Template, TemplateUsedTimes


class MemeViewSet(viewsets.ModelViewSet):
    """Готовые мемы."""

    queryset = Meme.objects.all()
    filter_backends = [DjangoFilterBackend, ]
    filterset_fields = ('author',)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return MemeReadSerializer
        return MemeWriteSerializer

    @method_decorator(cache_page(60))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=True)
    def download_meme(self, request, pk):
        '''Скачивает готовый мем в формате jpeg'''
        image = get_object_or_404(Meme, pk=pk).image
        if request.user.is_authenticated:
            filename = f'{request.user.username}_meme.jpg'
        else:
            filename = 'personal_meme.jpg'
        response = HttpResponse(image, content_type='image/jpeg')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response


class TemplateViewSet(viewsets.ModelViewSet):
    """Шаблоны мемов."""

    permission_classes = [AdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TemplateFilter
    ordering_fields = ['created_at']

    def get_queryset(self):
        queryset = Template.objects.filter(
            is_published=True).annotate(
            used_times=Case(
                When(Exists(
                    TemplateUsedTimes.objects.filter(
                        template=OuterRef('pk')
                    )
                ), then=TemplateUsedTimes.objects.filter(
                    template=OuterRef('pk')
                ).values('used_times')),
                default=Value(0)
            )
        ).order_by('-used_times')
        user = self.request.user
        if user.is_authenticated:
            return queryset.annotate(
                is_favorited=Exists(
                    Favorite.objects.filter(user=user, template=OuterRef('pk'))
                ))

        return queryset.annotate(is_favorited=Value(False))

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return TemplateReadSerializer
        return TemplateWriteSerializer

    @action(detail=True, methods=['post', 'delete'])
    def favorite(self, request, pk):
        '''Добавляет шаблон в избранные'''
        return create_delete_relation(
            self, request, pk, Favorite, FavoriteSerializer
        )


class TagViewSet(ListRetriveViewSet):
    """Теги шаблонов."""

    serializer_class = TagSerializer
    filter_backends = (DjangoFilterBackend, )
    filterset_class = TagSearchFilter

    def get_queryset(self):
        """Получить кверисет. Аннотируется количеством опубликованных
        шаблонов использующих этот тег и сортирует по нему по убывающей,
        потом лексикографически."""
        tags = Tag.objects.all()
        return tags.annotate(templates_use_this=Count(
            'memes',
            filter=Q(memes__is_published=True)
        )).order_by('-templates_use_this', 'name')


class CategoryViewSet(ListRetriveViewSet):
    """Категории шаблонов."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
