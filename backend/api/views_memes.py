from django.db.models import Case, Count, Exists, OuterRef, Q, Value, When
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response

from api.filters import CollectionFilter, TagSearchFilter, TemplateFilter
from api.paginators import CollectionPagination
from api.permissions import AdminOrReadOnly
from api.serializers_memes import (Category, CategorySerializer,
                                   CollectionDeleteSerializer,
                                   CollectionReadSerializer,
                                   CollectionWriteSerializer,
                                   FavoriteSerializer, MemeReadSerializer,
                                   MemeWriteSerializer, TagSerializer,
                                   TemplateReadSerializer,
                                   TemplateWriteSerializer)
from api.services import create_delete_relation
from api.viewsets import ListRetriveViewSet, ListViewSet
from memes.models import (Favorite, Meme, Tag, Template, TemplateUsedTimes,
                          UserCollection)


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
        """Скачивает готовый мем в формате jpeg."""
        image = get_object_or_404(Meme, pk=pk).image
        if request.user.is_authenticated:
            filename = f'{request.user.username}_meme.jpg'
        else:
            filename = 'personal_meme.jpg'
        response = HttpResponse(image, content_type='image/jpeg')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response


class TemplateViewSet(viewsets.ModelViewSet):
    """Шаблоны мемов.
    Сортировка шаблонов задается параметром ordering:
    - если параметр не задан, то по умолчанию выше будут шаблоны,
    которые чаще других использовались для создания мема
    - если задан параметр 'random', то шаблоны будут
    отсортированы в случайном порядке
    - если задан параметр '-published_at', то выше будут шаблоны
    опубликованные на сайте позднее, если 'published_at' то наоборот."""

    permission_classes = [AdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TemplateFilter
    ordering_fields = ('published_at', )

    def get_queryset(self):
        user = self.request.user
        queryset = Template.objects.filter(is_published=True).all()

        order_by = self.request.query_params.get('ordering')

        if order_by:
            if order_by == 'random':
                queryset = queryset.order_by('?')
        else:
            queryset = queryset.annotate(
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


class CollectionViewSet(ListViewSet):
    """Пользовательская коллекция мемов,
    принимает параметр "only_my" = "true" для
    отображения авторских мемов."""

    pagination_class = CollectionPagination
    permission_classes = (IsAuthenticated, )
    serializer_class = CollectionReadSerializer
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = CollectionFilter

    def get_queryset(self):
        user = self.request.user
        only_my = self.request.query_params.get('only_my')
        if only_my == 'true':
            return UserCollection.objects.filter(
                user=user, is_author=True
            ).all()
        return UserCollection.objects.filter(user=user).all()

    @swagger_auto_schema(
        request_body=CollectionWriteSerializer,
        method='post',
        responses={201: ''},
    )
    @action(
        detail=False,
        methods=['post', ],
        serializer_class=CollectionWriteSerializer,
    )
    def add(self, request):
        """Добавляет мем в коллекцию."""
        user = self.request.user
        serializer = CollectionWriteSerializer(
            data=request.data,
            context={
                'user': user,
            },
        )
        serializer.is_valid(raise_exception=True)
        meme = serializer.validated_data['meme']
        is_author = False
        if user == meme.author:
            is_author = True
        UserCollection.objects.create(
            user=user,
            meme=meme,
            is_author=is_author,
        )
        return Response(status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=CollectionDeleteSerializer,
        method='delete',
        responses={204: ''},
    )
    @action(
        detail=False,
        methods=['delete', ],
        serializer_class=CollectionDeleteSerializer,
    )
    def delete(self, request):
        """Удаляет мем из коллекции."""
        user = self.request.user
        serializer = CollectionDeleteSerializer(
            data=request.data,
            context={
                'user': user,
            },
        )
        serializer.is_valid(raise_exception=True)
        meme = serializer.validated_data['meme']
        UserCollection.objects.get(
            meme=meme,
            user=user,
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
