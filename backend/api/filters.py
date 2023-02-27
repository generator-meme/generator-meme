from rest_framework.filters import SearchFilter
# from django_filters.rest_framework import FilterSet, filters

# from memes.models import Template


class TagSearchFilter(SearchFilter):
    '''Поиск тегов по имени'''
    search_param = 'name'
