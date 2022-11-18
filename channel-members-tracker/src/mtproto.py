import os
from telethon import TelegramClient, sync
from telethon.sessions import StringSession


class TelegramAPI:
    def __init__(self):
        api_id = int(os.getenv('API_ID'))
        api_hash = os.getenv('API_HASH')
        session_key = StringSession(os.getenv('SESSION_KEY'))

        self.client = TelegramClient(session_key, api_id, api_hash)

        with self.client:
            self.channel = self.client.get_entity(os.getenv('CHANNEL_HANDLE'))

    def fetch_updates_starting_with(self, id_to_start_with: int):
        with self.client:
            return self.client.get_admin_log(self.channel, min_id=id_to_start_with)
