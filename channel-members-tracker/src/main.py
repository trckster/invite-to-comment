import os
from telethon import TelegramClient, sync
from telethon.sessions import StringSession
from dotenv import load_dotenv


def launch():
    load_dotenv()

    main()


def main():
    api_id = int(os.getenv('API_ID'))
    api_hash = os.getenv('API_HASH')
    session_key = StringSession(os.getenv('SESSION_KEY'))

    with TelegramClient(session_key, api_id, api_hash) as client:
        channel = client.get_entity(os.getenv('CHANNEL_HANDLE'))
        events = client.get_admin_log(channel)

        for event in events:
            if event.joined:
                print(f'User {event.user_id} joined')
            elif event.left:
                print(f'User {event.user_id} left')
