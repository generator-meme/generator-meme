from django_filters import rest_framework as filters
from rest_framework.filters import SearchFilter

from memes.models import Template


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
            'tag'
        ]


class TagSearchFilter(SearchFilter):
    """Поиск тегов по имени"""
    search_param = 'name'
