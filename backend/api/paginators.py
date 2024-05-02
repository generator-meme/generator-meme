from rest_framework.pagination import LimitOffsetPagination


class CollectionPagination(LimitOffsetPagination):
    """Пагинатор для мемов в коллеции пользователя."""
    default_limit = 10


class TemplateMainPagePagination(LimitOffsetPagination):
    """Пагинатор для мемов в коллеции пользователя."""
    default_limit = 21
