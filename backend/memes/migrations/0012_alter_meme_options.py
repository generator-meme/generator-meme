# Generated by Django 4.1.7 on 2023-05-22 08:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0011_alter_tag_options_alter_template_is_published'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='meme',
            options={'ordering': ('-created_at',), 'verbose_name': 'Готовый мем', 'verbose_name_plural': 'Готовые мемы'},
        ),
    ]