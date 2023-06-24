from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, permissions

from groups.models import Group, GroupMeme, GroupRole, GroupBannedUser, \
    GroupUser
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response

from api.permissions import IsGroupOwner, IsInGroup
from api.serializers_groups import (
    GroupFullSerializer, GroupSerializer,
    GroupUserSerializer, GroupWriteSerializer, GroupBannedUserReadSerializer,
    GroupMemeWriteSerializer, GroupBannedUserSerializer
)

from memes.models import Meme

User = get_user_model()


class GroupViewSet(viewsets.ModelViewSet):
    """Вьюсет групп"""
    queryset = Group.objects.all()

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
            elif request.user != user and GroupUser.objects.get(
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
            else:
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
