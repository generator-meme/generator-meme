from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"]
        query_params = query_string.decode()
        query_dict = parse_qs(query_params)
        headers = dict(scope['headers'])
        if b'authorization' in headers:
            token_name, token_key = headers[b'authorization'].decode().split()
            if token_name == 'Token':
                scope['user'] = await get_user(token_key)
        elif query_dict:
            token_key = query_dict['token'][0]
            scope['user'] = await get_user(token_key)
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)
