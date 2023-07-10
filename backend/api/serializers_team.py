from rest_framework.serializers import ModelSerializer

from team.models import TeamGroup, Teammate


class TeammateSerializer(ModelSerializer):
    """Сериализатор модели Teammate приложения Team."""

    class Meta:
        fields = (
            'name',
            'description',
            'link',
        )
        model = Teammate


class TeamGroupSerializer(ModelSerializer):
    """Сериализатор модели Group приложения Team."""

    teammates = TeammateSerializer(many=True, read_only=True)

    class Meta:
        fields = (
            'id',
            'name',
            'teammates',
        )
        model = TeamGroup
