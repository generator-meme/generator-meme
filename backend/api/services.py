from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from memes.models import Template


def additions(self, request, pk, model, modelserializer):
    if request.method != 'POST':
        action_model = get_object_or_404(
            model,
            user=request.user,
            template=get_object_or_404(Template, pk=pk)
        )
        self.perform_destroy(action_model)
        return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = modelserializer(
        data={
            'user': request.user.id,
            'template': get_object_or_404(Template, pk=pk).pk
        },
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
