from django.contrib.auth import get_user_model

from memes.models import Template

User = get_user_model()

def templates_statistics(request):
    """Контекстный процессор про шаблоны."""
    published = Template.objects.filter(is_published=True).count()
    non_published = Template.objects.filter(is_published=False).count()
    all_templates = published + non_published

    return {
        'template_table_name': 'Шаблоны мемов',
        'template_info': {
            'Опубликовано': published,
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
