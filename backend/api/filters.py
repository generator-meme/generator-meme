from rest_framework.filters import SearchFilter
# from django_filters.rest_framework import FilterSet, filters

# from memes.models import Template


class TagSearchFilter(SearchFilter):
    search_param = 'name'
