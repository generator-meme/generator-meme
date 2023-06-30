from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from memes.models import Template


@receiver(pre_save, sender=Template)
def update_published_at_save(sender, instance, **kwargs):
    """Обновляет время публикации шаблона на сайт."""
    if instance.pk:
        try:
            old_instance = Template.objects.get(pk=instance.pk)
            if not old_instance.is_published and instance.is_published:
                instance.published_at = timezone.now()
        except Template.DoesNotExist:
            pass
