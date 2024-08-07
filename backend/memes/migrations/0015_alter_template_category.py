# Generated by Django 4.1.9 on 2023-06-23 08:46

from django.db import migrations, models
import django.db.models.deletion
import memes.models


class Migration(migrations.Migration):

    dependencies = [
        ('memes', '0014_alter_category_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='category',
            field=models.ForeignKey(default=memes.models.Category.get_default_id, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='templates', to='memes.category'),
        ),
    ]
