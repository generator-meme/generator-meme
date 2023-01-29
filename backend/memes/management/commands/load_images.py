import csv
import sys

from django.core.management.base import BaseCommand

from memes.models import Template


maxInt = sys.maxsize

while True:

    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt / 10)


class Command(BaseCommand):

    def handle(self, *args, **options):
        self.import_ingredients()
        print('Шаблоны загружены.')

    def import_ingredients(self, file='memes.csv'):
        print(f'Загрузка {file}...')
        file_path = f'./data/{file}'
        with open(file_path, newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                status, created = Template.objects.update_or_create(
                    image=row[0],
                )
