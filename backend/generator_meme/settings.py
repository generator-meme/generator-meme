import os

from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', default=' ')

DEBUG = os.getenv('DEBUG', default=False) == 'True'

DEVELOPE = os.getenv('DEVELOPE', default=False) == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', default='*').split(',')

CSRF_TRUSTED_ORIGINS = ['https://ilovememes.ru', 'https://testmemes.ddns.net']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'drf_yasg',
    'social_django',
    'django_filters',
    'api',
    'memes',
    'users',
    'team',
    'groups',
    'drf_api_logger',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]

ROOT_URLCONF = 'generator_meme.urls'

TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATES_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'generator_meme.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': os.getenv('POSTGRES_PORT')
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

STATIC_URL = '/backend-static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'backend-static')

MEDIA_URL = '/backend-media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'backend-media')

AUTH_USER_MODEL = 'users.User'

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}

if DEVELOPE:
    EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
    EMAIL_FILE_PATH = os.path.join(BASE_DIR, 'sent_emails')
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
    SECURITY_EMAIL_SENDER = os.getenv('DEFAULT_FROM_EMAIL')
    EMAIL_USE_SSL = True
    EMAIL_USE_TLS = False
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    EMAIL_PORT = 465

DJOSER = {
    "HIDE_USER": True,
    'PERMISSIONS': {
        'user_list': ['rest_framework.permissions.AllowAny'],
        'user': ['djoser.permissions.CurrentUserOrAdminOrReadOnly']
    },
    "SERIALIZERS": {
        "user": "api.serializers_users.UsersSerializer",
        "current_user": "api.serializers_users.UsersSerializer",
    },
    'PASSWORD_RESET_CONFIRM_URL': 'reset/password/confirm/{uid}/{token}',
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": True
}

SITE_NAME = "Generator-meme"
DOMAIN = os.getenv('DOMAIN')

# SOCIAL_AUTH_JSONFIELD_ENABLED = True

AUTHENTICATION_BACKENDS = (
    'social_core.backends.vk.VKOAuth2',
    'social_core.backends.yandex.YandexOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.telegram.TelegramAuth',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_VK_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_VK_OAUTH2_KEY')
SOCIAL_AUTH_VK_OAUTH2_SECRET = os.getenv('SOCIAL_AUTH_VK_OAUTH2_SECRET')

SOCIAL_AUTH_YANDEX_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_YANDEX_OAUTH2_KEY')
SOCIAL_AUTH_YANDEX_OAUTH2_SECRET = os.getenv(
    'SOCIAL_AUTH_YANDEX_OAUTH2_SECRET')

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv(
    'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')

SOCIAL_AUTH_TELEGRAM_BOT_TOKEN = os.getenv('SOCIAL_AUTH_TELEGRAM_BOT_TOKEN')

# Setup support for proxy headers
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/api/auth/social/token'
SOCIAL_AUTH_VK_OAUTH2_SCOPE = ['email', ]
SOCIAL_AUTH_TELEGRAM_OAUTH2_SCOPE = ['email', ]
SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.social_auth.associate_by_email',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)

# записывать логи
# документация https://pypi.org/project/drf-api-logger/
DRF_API_LOGGER_DATABASE = True
# максимум 50 записей держит в кэше до записи в таблицу
DRF_LOGGER_QUEUE_MAX_SIZE = 50
# максимум раз в десять секунд пишет в таблицу
DRF_LOGGER_INTERVAL = 10
# плюс 180 минут к UTС часовой пояс мск
DRF_API_LOGGER_TIMEDELTA = 180
# формат ссылки на ручку
DRF_API_LOGGER_PATH_TYPE = 'FULL_PATH'
