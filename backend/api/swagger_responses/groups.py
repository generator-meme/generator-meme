from typing import List, Optional

from drf_yasg import openapi

from api.serializers_groups import (ChangeRoleSerializer, GroupFullSerializer,
                                    GroupSerializer, GroupWriteSerializer,
                                    NewOwnerSerializer)


def generate_400_response(fields: List[str]):
    default_value = openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(type=openapi.TYPE_STRING)
    )
    properties = {}
    for field in fields:
        properties[field] = default_value
    return openapi.Response("Bad Request", openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties=properties
    ))


DEFAULT_RESPONSES = {
    204: openapi.Response("Success response"),
    403: openapi.Response("Forbidden", openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'detail': openapi.Schema(type=openapi.TYPE_STRING)
        }
    )),
    404: openapi.Response("Not Found", openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'detail': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ))
}


class BaseSwaggerSchema:
    operation_description: str
    request_body: Optional[openapi.Schema]
    methods: List[str]
    manual_parameters: Optional[List[openapi.Parameter]]
    responses: openapi.Responses


class GroupGet(BaseSwaggerSchema):
    operation_description = """Поиск доступен по параметрам name и description
    Оба поиска работают без учёта регистра и проверяют
    вхождение строки заданной в поиск в значение поля модели;
    GET доступен всем"""
    request_body = None
    manual_parameters = [
        openapi.Parameter('name', openapi.IN_QUERY,
                          description="Поикс по имени",
                          type=openapi.TYPE_STRING),
        openapi.Parameter('description', openapi.IN_QUERY,
                          description="Поикс по описанию",
                          type=openapi.TYPE_STRING),
    ]
    responses = {200: GroupSerializer(many=True), }


class GroupPost(BaseSwaggerSchema):
    operation_description = """POST запрос доступен только авторизированным
    пользователям."""
    request_body = GroupWriteSerializer
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['name', 'description']),
        403: DEFAULT_RESPONSES[403]
    }


class GroupRetrive(BaseSwaggerSchema):
    operation_description = """Доступен всем пользователям."""
    request_body = None
    responses = {
        200: openapi.Response("Success response", GroupFullSerializer),
        404: DEFAULT_RESPONSES[404]
    }


class GroupPartialUpdate(BaseSwaggerSchema):
    operation_description = """PATCH запрос доступен только владельцу
    группы."""
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(
                title='Название',
                maxLength=300,
                minLength=1,
                type=openapi.TYPE_STRING
            ),
            'description': openapi.Schema(
                title='Описание',
                maxLength=500,
                type=openapi.TYPE_STRING
            ),
        },
    ),
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['name', 'description']),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupDestroy(BaseSwaggerSchema):
    operation_description = """DELETE запрос доступен только владельцу
    группы."""
    responses = {
        204: DEFAULT_RESPONSES[204],
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAddmemePost(BaseSwaggerSchema):
    operation_description = """Добавление мема в групппу. Доступен любому
    участнику группы."""
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meme': openapi.Schema(type=openapi.TYPE_STRING,
                                   field='UUIDField'),
        },
        required=['meme', ],
    ),
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['meme', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAddmemeDelete(BaseSwaggerSchema):
    operation_description = """Удаление мема из групппы. Доступен админу
    группы или тому, кто добавил мем."""
    responses = {
        204: DEFAULT_RESPONSES[204],
        400: generate_400_response(['meme', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAdduserPost(BaseSwaggerSchema):
    operation_description = """Добавление пользователя в групппу. Доступен
    администратору группы."""
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['user', ],
    ),
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAdduserDelete(BaseSwaggerSchema):
    operation_description = """Удаление пользователя из групппы. Удаление
    обычного пользователя из группы может произвести администратор этой
    группы, удаление администратора - только владелец группы."""
    responses = {
        204: DEFAULT_RESPONSES[204],
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAddusertobanPost(BaseSwaggerSchema):
    operation_description = """Добавление пользователя в бан лист группы.
    Доступен администратору группы. Пользователя со статусом администратор
    добавить в  бан лист может только владелец группы. Себя добавить в бан
    лист нельзя."""
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['user', ],
    ),
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupAddusertobanDelete(BaseSwaggerSchema):
    operation_description = """Удаление пользователя из бан листа группы.
    Удаление может произвести администратор этой группы."""
    responses = {
        204: DEFAULT_RESPONSES[204],
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupChangeownerPost(BaseSwaggerSchema):
    operation_description = """Сменить владельца группы. POST доступен только
    владельцу группы."""
    request_body = NewOwnerSerializer
    responses = {
        201: openapi.Response("Success response"),
        400: generate_400_response(['user_id', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupChangeuserrolePost(BaseSwaggerSchema):
    operation_description = """Задать участнику группы роль. POST доступен
    только владельцу группы."""
    request_body = ChangeRoleSerializer
    responses = {
        201: openapi.Response("Success response"),
        400: generate_400_response(['user_id', 'role_id']),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupEnterPost(BaseSwaggerSchema):
    operation_description = """Самостоятельный вход пользователя в группу.
    Доступен авторизованному пользователю. В теле не ждёт никаких данных."""
    request_body = openapi.Schema(type=openapi.TYPE_OBJECT)
    responses = {
        201: openapi.Response("Success response", GroupFullSerializer),
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupEnterDelete(BaseSwaggerSchema):
    operation_description = """Самостоятельный выход пользователя из группы.
    Владелец группы не может выйти до смены владельца."""
    responses = {
        204: DEFAULT_RESPONSES[204],
        400: generate_400_response(['user', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupMemeLikePost(BaseSwaggerSchema):
    operation_description = (
        """Добавить лайк мему в групппе. Доступен любому
        авторизованному участнику группы."""
    )
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meme_id': openapi.Schema(type=openapi.TYPE_STRING,
                                      field='UUIDField'),
        },
        required=['meme_id', ],
    ),
    responses = {
        201: openapi.Response("Success response"),
        400: generate_400_response(['meme_id', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }


class GroupMemeLikeDelete(BaseSwaggerSchema):
    operation_description = (
        """Убрать свой лайк у мема в групппе. Доступен любому
        авторизованному участнику группы."""
    )
    request_body = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meme_id': openapi.Schema(type=openapi.TYPE_STRING,
                                      field='UUIDField'),
        },
        required=['meme_id', ],
    ),
    responses = {
        204: DEFAULT_RESPONSES[204],
        400: generate_400_response(['meme_id', ]),
        403: DEFAULT_RESPONSES[403],
        404: DEFAULT_RESPONSES[404]
    }
