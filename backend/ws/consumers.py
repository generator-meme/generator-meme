import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.db.models import Exists, OuterRef

from groups.models import Group, GroupMeme, GroupMemeLike, GroupUser, Meme

User = get_user_model()

GROUP_MEME_WS_DATA = {}

CHAT_TYPES = [
    'chat_message',
    'direction',
    'like'
]


class GroupConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["group_name"]
        self.room_group_name = f"group_{self.room_name}"
        self.user = self.scope['user']
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )
        await self.accept()
        self.group = await get_group(self.room_name)
        if self.room_group_name not in GROUP_MEME_WS_DATA:
            GROUP_MEME_WS_DATA[self.room_group_name] = {}
        self.params = GROUP_MEME_WS_DATA[self.room_group_name]
        if not self.user.is_authenticated:
            await self.send(json.dumps(
                {"error": "User is not authenticated."}))  # Кириллица не
            # поддерживается или надо декодер на фронт
            await self.close()
            return
        user_is_group_admin = await check_user_is_group_admin(self.user,
                                                              self.group)
        if 'owner' not in self.params:
            if user_is_group_admin:
                self.params['owner'] = self.user
                memes = await get_group_memes(self.group)
                self.params['memes_list'] = memes
                self.params['current_meme_index'] = 0
                self.params['people'] = []
                self.params = await update_params(self.params)
            else:
                await self.send(
                    json.dumps({"error": "no translation"}))
                await self.close()
                return
        if 'people' in self.params:
            self.params['people'].append(self.user)
        data = await prepare_first_data(self.params, self.user, self.group)
        await self.send(json.dumps(data))
        # print(self.channel_layer.connection)
        # key = f"{self.channel_layer.prefix}:group:{
        # self.room_group_name}".encode("utf8")
        # conn = self.channel_layer.connection(
        # self.channel_layer.consistent_hash(self.room_group_name))
        # b = [x.decode("utf8") for x in await conn.zrange(key, 0, -1)]
        # print(len(b))
        # print(self.channel_name)

    async def disconnect(self, close_code):
        # Leave room group
        if 'owner' in self.params and self.params['owner'] == self.user:
            GROUP_MEME_WS_DATA[self.room_group_name] = {}
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "error_message",
                    "message": "Translation is over"
                }
            )
            # key = f"{self.channel_layer.prefix}:group:{
            # self.room_group_name}".encode("utf8")
            # conn = self.channel_layer.connection(
            # self.channel_layer.consistent_hash(self.room_group_name))
            # b = [x.decode("utf8") for x in await conn.zrange(key, 0, -1)]
            # for channel in b:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'websocket_disconnect',
                    'code': 204,
                }
            )
            # key = f"{self.channel_layer.prefix}:group:{
            # self.room_group_name}".encode("utf8")
            # conn = self.channel_layer.connection(
            # self.channel_layer.consistent_hash(self.room_group_name))
            # b = [x.decode("utf8") for x in await conn.zrange(key, 0, -1)]
            # print(len(b))
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
        if 'people' in self.params and self.user in self.params['people']:
            self.params['people'].remove(self.user)

    async def receive(self, text_data=None, bytes_data=None):
        params = self.params.copy()
        text_data_json = json.loads(text_data)
        if ('type' in text_data_json
                and text_data_json['type'] in CHAT_TYPES
                and 'message' in text_data_json):
            self.params = await update_by_type(text_data_json, self.params,
                                               self.group, self.user)
            if params['current_meme_index'] != self.params[
                'current_meme_index'
            ] or text_data_json['type'] == 'like':
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": text_data_json['type'],
                        "message": text_data_json['message']
                    }
                )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        await self.send(json.dumps({"message": message}))

    async def error_message(self, event):
        error = event['message']
        await self.send(json.dumps({"error": error}))

    async def direction(self, event):
        self.params = await update_params(self.params)

        data = await prepare_first_data(self.params, self.user, self.group)
        await self.send(json.dumps(data))

    async def like(self, event):
        data = await prepare_like_data(self.params, self.user, self.group)
        await self.send(json.dumps(data))


@database_sync_to_async
def get_group(group_name):
    try:
        group = Group.objects.get(name=group_name)
        return group
    except Group.DoesNotExist:
        return None


def check_user_in_group(user, group):
    if not user.is_authenticated:
        return False
    return GroupUser.objects.filter(group=group, user=user).exists()


@database_sync_to_async
def get_group_memes(group):
    return Meme.objects.filter(Exists(GroupMeme.objects.filter(
        group=group,
        meme=OuterRef("pk")
    ))).all()


@database_sync_to_async
def do_like(connection_params, user, group):
    group_meme = GroupMeme.objects.get(
        group=group,
        meme=connection_params['memes_list'][
            connection_params['current_meme_index']
        ]
    )
    is_like_exists = GroupMemeLike.objects.filter(
        user=user,
        group_meme=group_meme
    ).exists()
    if is_like_exists:
        GroupMemeLike.objects.filter(
            user=user,
            group_meme=group_meme
        ).delete()
    else:
        GroupMemeLike.objects.create(
            user=user,
            group_meme=group_meme
        )


async def prepare_like_data(connection_params, user, group):
    like_data = await check_likes_and_is_liked(
        connection_params, user, group
    )
    return {
        "like_counter": like_data[0],
        "is_liked": like_data[1],  # True or False
        "people": len(connection_params['people'])
    }


async def prepare_first_data(connection_params, user, group):
    like_data = await check_likes_and_is_liked(
        connection_params, user, group
    )
    return {
        "meme": connection_params['memes_list'][
            connection_params['current_meme_index']
        ].image.url,
        "first": connection_params['first'][0],  # True or False
        "last": connection_params['last'][0],  # True or False
        "like_counter": like_data[0],
        "is_liked": like_data[1],  # True or False
        "people": len(connection_params['people'])
    }


@database_sync_to_async
def check_likes_and_is_liked(connection_params, user, group):
    meme = connection_params['memes_list'][
        connection_params['current_meme_index']
    ]
    like_counter = GroupMemeLike.objects.filter(
        group_meme__meme=meme,
        group_meme__group=group
    ).count()
    is_liked = GroupMemeLike.objects.filter(
        group_meme__meme=meme,
        group_meme__group=group,
        user=user
    ).exists()
    return like_counter, is_liked


@database_sync_to_async
def update_params(params):
    params['first'] = params['current_meme_index'] == 0,
    params['last'] = params['current_meme_index'] == len(
        params['memes_list']
    ) - 1,
    return params


async def update_by_type(text_data_json, params, group, user):
    if text_data_json['type'] == 'direction' and params['owner'] == user:
        if (text_data_json['message'] == 'next'
                and not params['last'][0]):
            params['current_meme_index'] += 1

        if (text_data_json['message'] == 'previous'
                and not params['first'][0]):
            params['current_meme_index'] -= 1
    if text_data_json['type'] == 'like':
        if text_data_json['message'] == 'like':
            await do_like(params, user, group)
    return params


@database_sync_to_async
def check_user_is_group_admin(user, group):
    user_in_group = check_user_in_group(user, group)
    if not user_in_group:
        return False
    return GroupUser.objects.get(group=group, user=user).role.is_admin
