import base64
import hashlib
import os
from datetime import datetime

import requests
import vk_api
from django.core.management.base import BaseCommand
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())


LOGIN = os.environ.get('VK_LOGIN')
PASSWORD = os.environ.get('VK_PASSWORD')
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
        path = './backend-media/meme/template_images/'
        template_hash = self.hash_all_exsist(path)
        encoded_photos = self.encode_photos_to_base64(photos,
                                                      template_hash)
        self.create_csv_file(encoded_photos)
        print('End')

    def hash_md5_name(self, fname: str):
        """Получает хэш-сумму файла по названию."""
        with open(fname, "rb") as f:
            file_base_64 = base64.b64encode(f.read()).decode('utf-8')
        return hashlib.md5(file_base_64.encode('utf-8')).hexdigest()

    def hash_md5_file(self, file):
        """Получает хэш-сумму файла."""
        return hashlib.md5(file.encode('utf-8')).hexdigest()

    def hash_all_exsist(self, path: str) -> set[str]:
        """Возвращает множество уже имеющихся шаблонов."""
        templates_hash = set()
        for file in os.listdir(path):
            templates_hash.add(self.hash_md5_name(path+file))
        return templates_hash

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
            response = vk.photos.get(owner_id=PUBLICS[public],
                                     album_id="wall",
                                     count='200', rev=1,
                                     offset='0')
            for i in range(len(response['items'])):
                url_photo = response['items'][i]['sizes'][-1]['url']
                photos.append(url_photo)
        return photos

    def encode_photos_to_base64(self, photos: list, template_hash: set):
        """Кодирует фото в base64"""
        encoded_photos = []
        for photo_url in photos:
            response = requests.get(photo_url)
            url_encode = base64.b64encode(response.content).decode('utf-8')
            hash_new_template = self.hash_md5_file(url_encode)
            if not (hash_new_template in template_hash):
                encoded_photos.append(url_encode)
                print('add')
            else:
                print('double')
        return encoded_photos

    def create_csv_file(self, data: list):
        """
        Создает csv файл, где название соответствует дате загрузке картинок
        """
        file_name = f'{datetime.now().date()}_memes.csv'
        file_path = './data/'
        full_path = os.path.join(file_path, file_name)
        with open(full_path, 'w', newline='') as file_handler:
            for url in data:
                string = "data:image/jpeg;base64,"
                string += repr(url)[1:-1] + '\n'
                file_handler.write(string)
