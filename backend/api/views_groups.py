from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import (SAFE_METHODS, IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response

from api.permissions import IsGroupOwner, IsInGroup
from api.serializers_groups import (GroupBannedUserSerializer,
                                    GroupRoleSerializer,
                                    GroupFullSerializer,
                                    GroupMemeWriteSerializer, GroupSerializer,
                                    GroupUserSerializer, GroupWriteSerializer,
                                    NewOwnerSerializer,
                                    UserGroupReadSerializer)
from api.filters import GroupSearchFilter
from api.viewsets import ListRetriveViewSet, ListViewSet
from groups.models import (Group, GroupBannedUser, GroupMeme, GroupRole,
                           GroupUser)
from memes.models import Meme

User = get_user_model()


class GroupViewSet(viewsets.ModelViewSet):
    """Группы для готовых мемов
    Поиск доступен по параметрам name и description
    Оба поиска работают без учёта регистра и проверяют
    вхождение строки заданной в поиск в значение поля модели."""

    queryset = Group.objects.all()

    permission_classes = (IsAuthenticatedOrReadOnly, )

    filter_backends = (DjangoFilterBackend, )
    filterset_class = GroupSearchFilter

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            if self.action == 'retrieve':
                return GroupFullSerializer
            return GroupSerializer
        return GroupWriteSerializer

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

    @action(detail=True, methods=['post', 'delete'],
            permission_classes=[IsAuthenticated, ])
    def adduser(self, request, pk):
        """Добавить/удалить пользователя в группу."""
        current_group = get_object_or_404(Group, pk=pk)
        if GroupUser.objects.filter(
                group=current_group,
                user=request.user
        ).exists() and request.data.get('user'):
            if GroupUser.objects.get(
                    group=current_group,
                    user=request.user
            ).role.is_admin:
                user = get_object_or_404(User, id=request.data.get('user'))
            elif not GroupUser.objects.get(
                    group=current_group,
                    user=request.user
            ).role.is_admin and request.user.id != request.data.get('user'):
                return Response(
                    {"Owner_error": "Другого пользователя может добавить или "
                                    "удалить только администратор группы"},
                    status=status.HTTP_401_UNAUTHORIZED)
            else:
                user = request.user
        else:
            user = request.user
        if request.method != 'POST':
            action_model = get_object_or_404(
                GroupUser,
                user=user,
                group=current_group
            )
            if user == current_group.owner:
                return Response(
                    {"Owner_error": "Владелец группы не может быть удален."},
                    status=status.HTTP_400_BAD_REQUEST)
            if request.user != user and GroupUser.objects.get(
                    group=current_group,
                    user=user
            ).role.is_admin and request.user != current_group.owner:
                return Response(
                    {"Owner_error":
                     "Пользователя со статусом 'Администратор' может удалить "
                     "только владелец группы."},
                    status=status.HTTP_400_BAD_REQUEST)
            else:
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

    @action(detail=True, methods=['post', 'delete'],
            permission_classes=[IsAuthenticated, ])
    def addusertoban(self, request, pk):
        """Добавить/удалить пользователя в банлист группы."""
        current_group = get_object_or_404(Group, pk=pk)
        user = get_object_or_404(GroupUser,
                                 group=current_group,
                                 user=request.user
                                 )
        if not user.role.is_admin:
            return Response(
                {"Permission_error":
                    "Только пользователь со статусом 'Администратор' может "
                    "добавить или удалить пользователя в бан."},
                status=status.HTTP_400_BAD_REQUEST)
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
        serializer.save()
        GroupUser.objects.get(
            group=pk,
            user=request.data.get('user')
        ).delete()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post', 'delete'],
            permission_classes=[IsAuthenticated, IsInGroup, ])
    def addmeme(self, request, pk):
        """Добавить/удалить мем из группы."""
        current_group = get_object_or_404(Group, pk=pk)
        if request.method != 'POST':
            action_model = get_object_or_404(
                GroupMeme,
                meme=get_object_or_404(Meme, id=request.data.get('meme')),
                group=current_group
            )
            if request.user != action_model.added_by and not (
                GroupUser.objects.get(
                    group=current_group,
                    user=request.user
                ).role.is_admin
            ):
                return Response(
                    {"Added_by_error":
                     "Удалить мем может только тот кто его добавил или "
                     "'Администратор' группы."},
                    status=status.HTTP_400_BAD_REQUEST)
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = GroupMemeWriteSerializer(
            data={
                'meme': request.data.get('meme'),
                'group': pk
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(added_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        request_body=NewOwnerSerializer,
        method='post',
        responses={200: 'Успешная смена владельца'},
    )
    @action(
        detail=True,
        methods=['post', ],
        permission_classes=[
            IsAuthenticated,
            IsInGroup,
            IsGroupOwner,
        ],
        serializer_class=NewOwnerSerializer,
    )
    def changeowner(self, request, pk):
        """Сменить владельца группы."""
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
        return Response(status=status.HTTP_200_OK)


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
