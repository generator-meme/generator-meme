import pytest


@pytest.fixture
def admin(django_user_model):
    return django_user_model.objects.create_user(
        username='admin',
        email='admin@admin.fake',
        password='1234567',
        is_active=True,
        is_superuser=True
    )


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(
        username='TestUser',
        email='user@user.fake',
        password='1234567',
        is_active=True
    )


@pytest.fixture
def user_2(django_user_model):
    return django_user_model.objects.create_user(
        username='TestUser2',
        email='user2@user.fake',
        password='1234567',
        is_active=True
    )


@pytest.fixture
def user_3(django_user_model):
    return django_user_model.objects.create_user(
        username='TestUserAnother',
        email='user@user.fake',
        password='1234567',
        is_active=True
    )


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()


def client_to_user(user):
    from rest_framework.authtoken.models import Token
    from rest_framework.test import APIClient
    token, _ = Token.objects.get_or_create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
    return client


@pytest.fixture
def admin_client(admin):
    return client_to_user(admin)


@pytest.fixture
def user_client(user):
    return client_to_user(user)


@pytest.fixture
def user2_client(user_2):
    return client_to_user(user_2)


@pytest.fixture
def user3_client(user_3):
    return client_to_user(user_3)


@pytest.fixture
def anonymous_client():
    from rest_framework.test import APIClient
    return APIClient()
