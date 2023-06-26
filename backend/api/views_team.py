from api.serializers_team import TeamGroupSerializer
from api.viewsets import ListRetriveViewSet
from team.models import TeamGroup


class TeamGroupViewSet(ListRetriveViewSet):
    """Команда проекта."""

    queryset = TeamGroup.objects.all()
    serializer_class = TeamGroupSerializer
