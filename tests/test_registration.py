import pytest

from rest_framework.authtoken.models import Token

from users.models import User


@pytest.mark.django_db(transaction=True)
class TestRegistration:
    def test_registration_with_bad_data(self, anonymous_client):
        data_with_wrong_username = [
            {
                'username': 'qw',
                'email': 'test@test.test',
                'password': 'trewq54321',
            },
            {
            'username': 'qwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwqwq',
            'email': 'test@test.test',
            'password': 'trewq54321',
            }
        ]
        counter = User.objects.count()
        for data in data_with_wrong_username:
            response_with_wrong_data = anonymous_client.post(
                '/api/auth/users/',
                data=data
            )
            assert response_with_wrong_data.status_code != 201, (
                'Поле "username" должно быть в интервале от 3 до 50 символов.'
            )
        counter_2 = User.objects.count()
        assert counter == counter_2, ("Проверьте что польщователь не создается"
                                      " с неверными данными")

    def test_registration(self, anonymous_client):
        data = {
                'username': 'Alexander',
                'email': 'test@test.test',
                'password': 'trewq54321',
            }
        counter = User.objects.count()
        response = anonymous_client.post(
            '/api/auth/users/',
            data=data
        )
        assert response.status_code == 201, (
            f"Ответ должен быть 201, фактически {response.status_code}"
        )
        assert User.objects.count() == counter + 1, (
            "Проверьте что польщователь создается с верными данными"
        )
        created_user = User.objects.get(username=data['username'])

        assert created_user.email == data['email'], (
            "Проверьте что email записывается в бд"
        )
        assert created_user.is_active is False, (
            "Проверьте что созданный пользлватель требует активации."
        )

        User.objects.filter(username=data['username']).update(is_active=True)

        token_counter = Token.objects.count()
        response = anonymous_client.post(
            '/api/auth/token/login/',
            data={
                'email': data['email'],
                'password': data['password']
            })
        assert response.status_code == 200, (
            f'Проверьте что статус ответа на запрос получения токена 200, '
            f'фактически {response.status_code}'
        )
        assert Token.objects.count() == token_counter + 1, (
            "Проверьте что токен для пользователя создается"
        )
        assert response.data['auth_token'], (
            "Проверьте что в ответе содержится поле auth_token"
        )
        data['token'] = f"Token {response.data['auth_token']}"

        anonymous_client.credentials(HTTP_AUTHORIZATION=data['token'])
        response = anonymous_client.post('/api/auth/token/logout/')
        assert response.status_code == 204, (
            f'Проверьте что статус ответа на запрос получения токена 204, '
            f'фактически {response.status_code}'
        )
        assert Token.objects.count() == token_counter, (
            "Проверьте что токен для пользователя удаляется"
        )


@pytest.mark.django_db(transaction=True)
class TestUserProfile:
    profile_url = '/api/auth/users/me/'

    def test_profile_get_response(self, user_client):
        response = user_client.get(self.profile_url)
        assert response.status_code == 200, (
            f'Проверьте что статус ответа на запрос 200, '
            f'фактически {response.status_code}'
        )

    def test_profile_patch_action(self, user_client, user_2):
        wrong_data = [{'username': 'TestUser2'}, {'email': 'user2@user.fake'}]
        for data in wrong_data:
            response = user_client.patch(self.profile_url, data=data)
            assert response.status_code == 400, (
                f'Проверьте что статус ответа на PATCH запрос c занятыми '
                f'данными возвращает 400, фактически {response.status_code}'
            )
        new_data = [{'name': 'NewTestUser2'}, {'email': 'newuser2@user.fake'}]
        for data in new_data:
            response = user_client.patch(self.profile_url, data=data)
            assert response.status_code == 200, (
                f'Проверьте что статус ответа на PATCH запрос c новыми '
                f'вылидными данными возвращает 200, '
                f'фактически {response.status_code}'
            )

    def test_profile_delete_action(self, user_client, user_2):
        user_count = User.objects.count()
        response = user_client.delete(self.profile_url, data={
            "current_password": "1234567"
        })

        assert response.status_code == 204, (
            f'Проверьте что статус ответа на DELETE запрос  возвращает 204, '
            f'фактически {response.status_code}'
        )
        assert User.objects.count() == user_count - 1, (
            'Проверьте, что пользователь удалется из базы'
        )
