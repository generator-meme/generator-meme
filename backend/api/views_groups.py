from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.filters import GroupSearchFilter
from api.permissions import (IsGroupAdmin, IsGroupAdminOrMemeAddedBy,
                             IsGroupOwner, IsInGroup)
from api.serializers_groups import (ChangeRoleSerializer, EnterGroupSerializer,
                                    GroupBannedUserSerializer,
                                    GroupFullSerializer,
                                    GroupMemeDeleteSerializer,
                                    GroupMemeWriteSerializer,
                                    GroupRoleSerializer, GroupSerializer,
                                    GroupUserDeleteSerializer,
                                    GroupUserSerializer, GroupWriteSerializer,
                                    NewOwnerSerializer,
                                    UserGroupReadSerializer)
from api.viewsets import ListRetriveViewSet, ListViewSet
from groups.models import (Group, GroupBannedUser, GroupMeme, GroupRole,
                           GroupUser)
from memes.models import Meme

User = get_user_model()


class GroupViewSet(viewsets.ModelViewSet):
    """Группы для готовых мемов
    Поиск доступен по параметрам name и description
    Оба поиска работают без учёта регистра и проверяют
    вхождение строки заданной в поиск в значение поля модели;
    GET доступен всем
    POST зарегистрированным пользователям
    DELETE и PATCH только владельцу группы."""

    queryset = Group.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = GroupSearchFilter
    http_method_names = ['get', 'post', 'patch', 'delete', ]
    permission_classes_by_action = {
        'POST': [IsAuthenticated, ],
        'GET': [AllowAny, ],
        'DELETE': [IsAuthenticated, IsGroupOwner, ],
        'PATCH': [IsAuthenticated, IsGroupOwner, ],
    }

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            if self.action == 'retrieve':
                return GroupFullSerializer
            return GroupSerializer
        return GroupWriteSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated, ]

        if self.request.method == "GET":
            permission_classes = self.permission_classes_by_action['GET']

        elif self.request.method == "POST":
            permission_classes = self.permission_classes_by_action['POST']

        elif self.request.method == "DELETE":
            permission_classes = self.permission_classes_by_action['DELETE']

        elif self.request.method == "PATCH":
            permission_classes = self.permission_classes_by_action['PATCH']

        return [permission() for permission in permission_classes]

    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(owner=user)
        group = Group.objects.get(
            owner=self.request.user,
            name=self.request.data.get('name')
        )
        GroupUser.objects.create(
            group=group,
            user=user,
            role=GroupRole.objects.get_or_create(name="Администратор",
                                                 is_admin=True)[0]
        )

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
            required=['user', ],
        ),
        methods=[
            'post',
            'delete',
        ],
    )
    @action(detail=True,
            methods=['post',
                     'delete'],
            permission_classes_by_action={
                'POST': [IsAuthenticated, IsGroupAdmin],
                'DELETE': [IsAuthenticated, IsGroupAdmin],
            }
            )
    def adduser(self, request, pk):
        """Добавление/удаление пользователя в группу администратором
        POST и DELETE доступны администратору группы."""
        current_group = get_object_or_404(Group, pk=pk)
        user = get_object_or_404(User, pk=request.data.get('user'))
        self.check_object_permissions(request, current_group)
        if request.method != 'POST':
            serializer = GroupUserDeleteSerializer(
                data={
                    'user': request.data.get('user'),
                    'group': current_group.pk
                },
                context={'request': request,
                         'user': request.data.get('user'),
                         'group': pk
                         }
            )
            serializer.is_valid(raise_exception=True)
            action_model = get_object_or_404(
                GroupUser,
                user=user,
                group=current_group
            )
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = GroupUserSerializer(
            data={
                'user': user.pk,
                'group': current_group.pk
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            nullable=True,
        ),
        methods=[
            'post',
            'delete',
        ],
    )
    @action(detail=True,
            methods=['post', 'delete'],
            permission_classes_by_action={
                'POST': [IsAuthenticated, ],
                'DELETE': [IsAuthenticated, ],
            }
            )
    def enter(self, request, pk):
        """Самостоятельный вход/выход пользователя в/из группы
        POST и DELETE доступны авторизованному пользователю
        В теле не ждёт никаких данных."""
        current_group = get_object_or_404(Group, pk=pk)
        user = request.user
        self.check_object_permissions(request, current_group)
        if request.method != 'POST':
            serializer = GroupUserDeleteSerializer(
                data={
                    'user': user.id,
                    'group': pk
                },
                context={'request': request,
                         'user': user.id,
                         'group': pk
                         }
            )
            serializer.is_valid(raise_exception=True)
            action_model = get_object_or_404(
                GroupUser,
                user=user,
                group=current_group
            )
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = EnterGroupSerializer(
            data={
                'user': user.pk,
                'group': current_group.pk
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
            required=['user', ],
        ),
        methods=[
            'post',
            'delete',
        ],
    )
    @action(
        detail=True,
        methods=[
            'post',
            'delete',
        ],
        permission_classes_by_action={
            'POST': [IsAuthenticated, IsInGroup, IsGroupAdmin],
            'DELETE': [IsAuthenticated, IsInGroup, IsGroupAdmin],
        }
    )
    def addusertoban(self, request, pk):
        """Добавить/удалить пользователя в банлист группы
        POST и DELETE доступны администратору группы."""
        current_group = get_object_or_404(Group, pk=pk)
        self.check_object_permissions(request, current_group)
        if request.method != 'POST':
            action_model = get_object_or_404(
                GroupBannedUser,
                user=get_object_or_404(User, id=request.data.get('user')),
                group=current_group
            )
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = GroupBannedUserSerializer(
            data={
                'user': request.data.get('user'),
                'group': pk
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
            GroupUser.objects.get(
                group=pk,
                user=request.data.get('user')
            ).delete()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meme': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['meme', ],
        ),
        methods=[
            'post',
            'delete',
        ],
    )
    @action(
        detail=True,
        methods=[
            'post',
            'delete',
        ],
        permission_classes_by_action={
            'POST': [IsAuthenticated, IsInGroup],
            'DELETE': [IsAuthenticated, IsInGroup,
                       IsGroupAdminOrMemeAddedBy],
        }
    )
    def addmeme(self, request, pk):
        """Добавить/удалить мем из группы
        POST доступен участнику группы
        DELETE доступен админу группы или тому, кто добавил мем."""
        current_group = get_object_or_404(Group, pk=pk)
        if request.method != 'POST':
            serializer = GroupMemeDeleteSerializer(
                data={
                    'meme': request.data.get('meme'),
                    'group': pk,
                },
                context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            action_model = get_object_or_404(
                GroupMeme,
                meme=get_object_or_404(Meme, id=request.data.get('meme')),
                group__id=pk,
            )
            self.check_object_permissions(request, current_group)
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        self.check_object_permissions(request, current_group)
        serializer = GroupMemeWriteSerializer(
            data={
                'meme': request.data.get('meme'),
                'group': pk,
                'added_by': request.user.id,
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=NewOwnerSerializer,
        method='post',
        responses={201: 'Успешная смена владельца'},
    )
    @action(
        detail=True,
        methods=['post', ],
        permission_classes_by_action={
            'POST': [IsAuthenticated, IsInGroup, IsGroupOwner]
        },
        serializer_class=NewOwnerSerializer,
    )
    def changeowner(self, request, pk):
        """Сменить владельца группы
        POST доступен только владельцу группы."""
        current_group = get_object_or_404(Group, pk=pk)
        current_user_id = request.user.id
        new_owner_id = request.data.get('user_id')

        self.check_object_permissions(request, current_group)

        serializer = NewOwnerSerializer(
            data=request.data,
            context={
                'current_group': current_group,
                'current_user_id': current_user_id,
                'new_owner_id': new_owner_id,
            },
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            current_group.owner_id = new_owner_id
            current_group.save()
            new_owner_in_group = get_object_or_404(
                GroupUser,
                group=current_group,
                user_id=new_owner_id,
            )
            new_owner_in_group.role = GroupRole.objects.get_or_create(
                name="Администратор",
                is_admin=True,
            )[0]
            new_owner_in_group.save()
        return Response(status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=ChangeRoleSerializer,
        method='post',
        responses={201: 'Успешная смена роли'},
    )
    @action(
        detail=True,
        methods=['post', ],
        permission_classes_by_action={
            'POST': [IsAuthenticated, IsInGroup, IsGroupOwner]
        },
        serializer_class=NewOwnerSerializer,
    )
    def changeuserrole(self, request, pk):
        """Задать участнику группы роль
        POST доступен только владельцу группы."""
        current_group = get_object_or_404(Group, pk=pk)
        user_id = request.data.get('user_id')
        role_id = request.data.get('role_id')
        user_in_group = GroupUser.objects.filter(
            group=current_group,
            user_id=user_id
        )

        self.check_object_permissions(request, current_group)

        serializer = ChangeRoleSerializer(
            data=request.data,
            context={
                'user_id': user_id,
                'role_id': role_id,
                'user_in_group': user_in_group,
            },
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            user_in_group_object = user_in_group[0]
            user_in_group_object.role_id = role_id
            user_in_group_object.save()

        return Response(status=status.HTTP_201_CREATED)


class UserGroupsViewSet(ListViewSet):
    """Список групп в которых состоит пользователь
    Содержит информацию о группе, дате вступления,
    роль пользователя в группе и отметку о том,
    является ли пользователь владельцем данной группы.
    Поумолчанию отсортированы по названию группы лексикографически.
    """

    serializer_class = UserGroupReadSerializer
    permission_classes = (IsAuthenticated, )
    filter_backends = [OrderingFilter, ]
    ordering = ('group__name',)

    def get_queryset(self):
        user = self.request.user
        return user.user_groups.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class GroupRoleViewSet(ListRetriveViewSet):
    """Возможные роли пользователей в группах мемов."""

    queryset = GroupRole.objects.all()
    serializer_class = GroupRoleSerializer
