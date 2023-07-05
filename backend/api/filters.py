from django_filters import rest_framework as filters

from groups.models import Group
from memes.models import Tag, Template


class MultiValueCharFilter(filters.BaseCSVFilter, filters.CharFilter):
    """Множественный фильтр для параметра
    Срабатывает, если объект имеет совпадение по
    всем значениям из запроса."""

    def filter(self, qs, value):
        values = value or []

        for value in values:
            qs = super(MultiValueCharFilter, self).filter(qs, value)

        return qs


class TemplateFilter(filters.FilterSet):
    """Фильтр для вью шаблонов мемов."""
    tag = MultiValueCharFilter(lookup_expr='exact')

    class Meta:
        model = Template
        fields = [
            'tag',
            'category',
        ]


class TagSearchFilter(filters.FilterSet):
    """Поиск тегов по имени"""

    name = filters.CharFilter(lookup_expr='istartswith')

    class Meta:
        model = Tag
        fields = ('name',)


def user_groups(request):
    if request is None:
        return Group.objects.none()

    groups = Group.objects.all()
    return groups


class GroupSearchFilter(filters.FilterSet):
    """Поиск по группам мемов."""

    name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    user = filters.ModelChoiceFilter(queryset=user_groups)

    class Meta:
        model = Group
        fields = (
            'name',
            'description',
            'users'
        )
