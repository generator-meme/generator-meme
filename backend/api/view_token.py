from django.contrib.auth import logout
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def set_token(request):
    user = request.user
    if user.is_authenticated:
        token, _ = Token.objects.get_or_create(user=user)
        logout(request)
        return redirect(f'/auth/social/{token}')
    return redirect('/')
