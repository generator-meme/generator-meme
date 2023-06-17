from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets, permissions

from groups.models import Group, GroupUser
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS
from rest_framework.response import Response

from .serializers_groups import (
    GroupFullSerializer, GroupSerializer,
    GroupUserSerializer, GroupWriteSerializer
)
from users.models import User



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
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post', 'delete'])
    def adduser(self, request, pk):
        if request.data.get('user'):
            user = get_object_or_404(User, id=request.data.get('user'))
        else:
            user = request.user
        if request.method != 'POST':
            action_model = get_object_or_404(
                GroupUser,
                user=user,
                group=get_object_or_404(Group, pk=pk)
            )
            self.perform_destroy(action_model)
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = GroupUserSerializer(
            data={
                'user': user.pk,
                'group': get_object_or_404(Group, pk=pk).pk
            },
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
