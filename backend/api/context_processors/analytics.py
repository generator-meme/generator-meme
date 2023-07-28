from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone

from groups.models import Group
from memes.models import Meme, Template

User = get_user_model()


def templates_statistics(request):
    """Контекстный процессор про шаблоны."""
    published = Template.objects.filter(is_published=True).count()
    non_published = Template.objects.filter(is_published=False).count()
    all_templates = published + non_published
    without_tags = Template.objects.annotate(
        num_tags=Count('tag')
    ).filter(num_tags=0, is_published=True).count()

    return {
        'template_table_name': 'Шаблоны мемов',
        'template_info': {
            'Опубликовано': published,
            'Без тегов': without_tags,
            'Не опубликовано': non_published,
            'Всего': all_templates,
        }
    }


def users_statistics(request):
    """Контекстный процессор про пользователей."""
    all_users = User.objects.all().count()
    active_users = User.objects.filter(is_active=True).count()

    return {
        'user_table_name': 'Пользователи',
        'user_info': {
            'Всего': all_users,
            'Активных': active_users,
        }
    }


def meme_statistics(request):
    """Контекстный процессор про готовые мемы."""
    current_datetime = timezone.now()
    today = Meme.objects.filter(
        created_at__date=current_datetime.date()
    ).count()
    week = Meme.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=7)
    ).count()
    month = Meme.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=30)
    ).count()

    return {
        'meme_table_name': 'Сделано мемов',
        'meme_info': {
            'Сегодня': today,
            'За неделю': week,
            'За месяц': month,
        }
    }


def group_statistics(request):
    """Контекстный процессор про группы."""
    groups = Group.objects.all().count()

    return {
        'group_table_name': 'Группы мемов',
        'group_info': {
            'Всего': groups,
        }
    }
