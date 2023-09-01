import base64
import json
import secrets
from datetime import datetime

from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer, \
    AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db.models import Exists, OuterRef

from groups.models import Group, GroupMeme, GroupMemeLike, GroupUser, Meme

# from .models import Message, Conversation
# from .serializers import MessageSerializer
#
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
        self.group = await get_group(self.room_name)
        user_in_group = await check_user_in_group(self.user, self.group)
        if not user_in_group:
            await self.close()
        if self.room_group_name not in GROUP_MEME_WS_DATA:
            GROUP_MEME_WS_DATA[self.room_group_name] = {}
        self.params = GROUP_MEME_WS_DATA[self.room_group_name]
        if 'owner' not in self.params:
            self.params['owner'] = self.user
            memes = await get_group_memes(self.group)
            self.params['memes_list'] = memes
            self.params['current_meme_index'] = 0
            self.params = await update_params(self.params)

        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )
        data = await prepare_first_data(self.params, self.user, self.group)
        await self.accept()
        await self.send(json.dumps(data))


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )
        if self.params['owner'] == self.user:
            GROUP_MEME_WS_DATA[self.room_group_name] = {}


    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        # parse the json data into dictionary object

        text_data_json = json.loads(text_data)
        # chat_type = text_data_json['type']
        if 'type' in text_data_json and text_data_json['type'] in CHAT_TYPES:
            self.params = await update_by_type(text_data_json, self.params,
                                               self.group, self.user)
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


@database_sync_to_async
def check_user_in_group(user, group):
    if not user.is_authenticated:
        return False
    return GroupUser.objects.filter(group=group, user=user).exists()


@database_sync_to_async
def get_group_memes(group):
    memes = Meme.objects.filter(Exists(GroupMeme.objects.filter(
        group=group,
        meme=OuterRef("pk")
    ))).all()
    return memes


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


@database_sync_to_async
def prepare_like_data(connection_params, user, group):
    data = {}
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
    data['like_counter'] = like_counter
    data['is_liked'] = is_liked
    return data

@database_sync_to_async
def prepare_first_data(connection_params, user, group):
    data = {
        "meme": connection_params['memes_list'][
            connection_params['current_meme_index']
        ].image.url,
        "first": connection_params['first'][0],  # True or False
        "last": connection_params['last'][0],  # True or False
        "like_counter": "",
        "is_liked": "",  # True or False
    }
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
    data['like_counter'] = like_counter
    data['is_liked'] = is_liked
    return data


@database_sync_to_async
def update_params(params):
    params['first'] = params['current_meme_index'] == 0,
    params['last'] = params['current_meme_index'] == len(
        params['memes_list']
    ) - 1,
    return params


async def update_by_type(text_data_json, params, group, user):
    if text_data_json['type'] == 'direction':
        if text_data_json['message'] == 'next' \
                and not params['last'][0]:
            params['current_meme_index'] += 1

        if text_data_json['message'] == 'previous' \
                and not params['first'][0]:
            params['current_meme_index'] -= 1
    if text_data_json['type'] == 'like':
        if text_data_json['message'] == 'like':
            await do_like(params, user, group)
    return params

