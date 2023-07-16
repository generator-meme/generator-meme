from django.apps import AppConfig


class MemeConfig(AppConfig):
    name = 'memes'
    verbose_name = 'Мемы'

    def ready(self):
        import memes.signals  # noqa
