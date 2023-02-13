import base64
import os
import vk_api
import requests


from django.core.management.base import BaseCommand
from dotenv import load_dotenv, find_dotenv
from datetime import datetime

load_dotenv(find_dotenv())


LOGIN = os.environ.get('VK_LOGIN')
PASSWORD = os.environ.get('VK_PASSWORSD')
TOKEN = os.environ.get('VK_TOKEN')

PUBLICS = {
    'https://vk.com/public172222275': -172222275,
    'https://vk.com/mem_box1': -181993900,
}


class Command(BaseCommand):
    """Команда для получения шаблонов мемов из пабликов ВК"""

    def handle(self, *args, **options):
        print('Start')
        photos = self.download_photo()
        encoded_photos = self.encode_photos_to_base64(photos)
        self.create_csv_file(encoded_photos)
        print('End')

    def download_photo(self):
        """Получает ссылки на изображения из пабликов в ВК"""
        vk_session = vk_api.VkApi(LOGIN, PASSWORD)
        try:
            vk_session.auth()
        except vk_api.AuthError as error_msg:
            print(error_msg)
            return

        vk = vk_session.get_api()

        photos = []

        for public in PUBLICS:
            response = vk.photos.get(owner_id=PUBLICS[public], album_id="wall",
                                     count='10', rev=1,
                                     offset='10')
            for i in range(len(response['items'])):
                url_photo = response['items'][i]['sizes'][-1]['url']
                photos.append(url_photo)

        return photos

    def encode_photos_to_base64(self, photos: list):
        """Кодирует фото в base64"""
        encoded_photos = []
        for photo_url in photos:
            url_encode = base64.b64encode(requests.get(photo_url).content)
            encoded_photos.append(url_encode)
        return encoded_photos

    def create_csv_file(self, data: list):
        """Создает csv файл, где название соответствует дате загрузке картинок"""
        file_name = f'{datetime.now().date()}_memes.csv'
        file_path = './data/'
        full_path = os.path.join(file_path, file_name)
        with open(full_path, 'a') as file_handler:
            for file in data:
                image_base64 = base64.b64encode(file).decode('utf-8')
                string = "data:image/jpeg;base64,"
                string += repr(image_base64)[1:-1] + '\n'
                file_handler.write(string)
