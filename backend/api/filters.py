from rest_framework.filters import SearchFilter


class TagSearchFilter(SearchFilter):
    '''Поиск тегов по имени'''
    search_param = 'name'
