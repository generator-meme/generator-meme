from rest_framework import status, viewsets, permissions

from groups.models import Group

from .serializers_groups import GroupFullSerializer, GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """Вьюсет групп"""
    queryset = Group.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GroupFullSerializer
        return GroupSerializer
