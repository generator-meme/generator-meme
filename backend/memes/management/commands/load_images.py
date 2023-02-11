import requests
from django.core.management.base import BaseCommand

AUTH_URL = 'http://localhost/api/auth/token/login'
TEMPLATE_URL = 'http://localhost/api/templates/'
EMAIL = "admin@gmail.com"
PASSWORD = "admin"
AUTH_DATA = {
    "email": EMAIL,
    "password": PASSWORD
}


class Command(BaseCommand):

    def handle(self, *args, **options):
        token = self.get_token()
        print('Вход выполнен')
        self.upload_images(token)
        print('Шаблоны загружены.')

    def get_token(self):
        print('Аутентификация...')
        data = requests.post(AUTH_URL, data=AUTH_DATA)
        return data.content.decode('utf-8')[15:-2]

    def upload_images(self, token, file='memes.csv'):
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