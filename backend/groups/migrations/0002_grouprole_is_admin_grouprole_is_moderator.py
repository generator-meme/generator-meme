# Generated by Django 4.1.7 on 2023-06-10 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='grouprole',
            name='is_admin',
            field=models.BooleanField(default=False, verbose_name='Уровень администратора'),
        ),
        migrations.AddField(
            model_name='grouprole',
            name='is_moderator',
            field=models.BooleanField(default=False, verbose_name='Уровень модератора'),
        ),
    ]
