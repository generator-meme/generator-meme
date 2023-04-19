# Generated by Django 4.1.7 on 2023-04-19 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0010_templateusedtimes'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tag',
            options={'ordering': ('name',), 'verbose_name': 'Тег', 'verbose_name_plural': 'Теги'},
        ),
        migrations.AlterField(
            model_name='template',
            name='is_published',
            field=models.BooleanField(default=False, verbose_name='Опубликован'),
        ),
    ]