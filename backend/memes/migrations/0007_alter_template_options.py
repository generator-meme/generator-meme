# Generated by Django 4.1.7 on 2023-02-28 15:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0006_alter_template_options_alter_favorite_template'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='template',
            options={'ordering': ('-created_at',), 'verbose_name': 'Шаблон мема', 'verbose_name_plural': 'Шаблоны мемов'},
        ),
    ]
