# Generated by Django 4.1.10 on 2023-07-19 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0016_template_published_at_alter_template_created_at'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='template',
            options={'ordering': ('-published_at',), 'verbose_name': 'Шаблон мема', 'verbose_name_plural': 'Шаблоны мемов'},
        ),
    ]
