# Generated by Django 2.2.16 on 2023-02-12 20:23

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
            options={
                'verbose_name': 'Избранный шаблон',
                'verbose_name_plural': 'Избранные шаблоны',
                'ordering': ('user',),
            },
        ),
        migrations.CreateModel(
            name='Meme',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to='meme/memes_images', verbose_name='Изображение')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True, verbose_name='Название тега')),
                ('slug', models.SlugField(unique=True, verbose_name='Slug тега')),
            ],
            options={
                'verbose_name': 'Тег',
                'verbose_name_plural': 'Теги',
            },
        ),
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to='meme/template_images', verbose_name='Изображение')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')),
                ('tag', models.ManyToManyField(blank=True, related_name='memes', to='memes.Tag', verbose_name='теги')),
            ],
            options={
                'verbose_name': 'Шаблон мема',
                'verbose_name_plural': 'Шаблоны мемов',
            },
        ),
    ]
