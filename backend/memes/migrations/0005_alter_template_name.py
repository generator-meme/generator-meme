# Generated by Django 4.1.7 on 2023-02-28 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0004_alter_meme_options_template_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Название шаблона'),
        ),
    ]
