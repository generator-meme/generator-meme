from rest_framework.pagination import LimitOffsetPagination


class TemplatePagination(LimitOffsetPagination):
    """Пагинатор для шаблонов мемов."""
    default_limit = 21
