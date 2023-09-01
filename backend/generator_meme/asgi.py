import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'generator_meme.settings')
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from ws.tokenauth_middleware import TokenAuthMiddleware

from ws import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'generator_meme.settings')

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(URLRouter(routing.websocket_urlpatterns)))
})
