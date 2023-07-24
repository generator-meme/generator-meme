from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def set_token(request):
    user = request.user
    if user.is_authenticated:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'token': token.key
        }, status.HTTP_200_OK)
    return Response({
        'message': 'Вы не авторизированы!'
    }, status.HTTP_401_UNAUTHORIZED)
