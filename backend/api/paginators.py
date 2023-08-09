from rest_framework.pagination import LimitOffsetPagination


class CollectionPagination(LimitOffsetPagination):
    """Пагинатор для шаблонов мемов."""
    default_limit = 10
