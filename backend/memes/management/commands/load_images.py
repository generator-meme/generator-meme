import os
import requests

from django.core.management.base import BaseCommand
from dotenv import load_dotenv
from datetime import datetime

DOMAIN = os.environ.get('DOMAIN')

load_dotenv()

if DOMAIN == 'host.docker.internal':
    AUTH_URL = f'http://{DOMAIN}/api/auth/token/login'
    TEMPLATE_URL = f'http://{DOMAIN}/api/templates/'
else:
    AUTH_URL = f'https://{DOMAIN}/api/auth/token/login'
    TEMPLATE_URL = f'https://{DOMAIN}/api/templates/'

EMAIL = os.environ.get('EMAIL')
PASSWORD = os.environ.get('PASSWORD')

AUTH_DATA = {
    "email": EMAIL,
    "password": PASSWORD
}


class Command(BaseCommand):
    """Команда для загрузки шаблонов в БД"""
    def handle(self, *args, **options):
        token = self.get_token()
        print('Вход выполнен')
        self.upload_images(token)
        print('Шаблоны загружены.')

    def get_token(self):
        print('Аутентификация...')
        data = requests.post(AUTH_URL, data=AUTH_DATA)
        return data.content.decode('utf-8')[15:-2]

    def upload_images(self, token):
        if DOMAIN == 'host.docker.internal':
            file = 'memes.csv'
        else:
            file = f'{datetime.now().date()}_memes.csv'
        print(f'Загрузка {file}...')
        file_path = f'./data/{file}'
        with open(file_path, newline='') as f:
            images = f.read()
            list_base64 = images.split('\n')
            for image_index in range(len(list_base64) - 1):
                auth = {
                    'Authorization': f'Token {token}'
                }
                data = {
                    "image": list_base64[image_index]
                }
                status = requests.post(TEMPLATE_URL, data=data, headers=auth)
                print(
                    f'Код ответа HTTP: {status.status_code}',
                    f'Порядковый номер шаблона: {image_index + 1}'
                )
