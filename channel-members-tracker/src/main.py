import os

from telethon import TelegramClient, events, sync
from dotenv import load_dotenv


def launch():
    load_dotenv()
    test()


def test():
    api_id = int(os.getenv('API_ID'))
    api_hash = os.getenv('API_HASH')

    with TelegramClient('anon', api_id, api_hash) as client:
        client.loop.run_until_complete(client.send_message('me', 'Hello, myself!'))
