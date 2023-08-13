import pytest


@pytest.mark.django_db(transaction=True)
class TestSumm:
    def test_passing(self, anonymous_client):
        response = anonymous_client.get('/api/auth/users/me/')
        assert response.status_code != 200
