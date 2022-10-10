import json
import os
from telethon import TelegramClient, sync
from telethon.sessions import StringSession
from dotenv import load_dotenv
from src.database import Database
from src.rabbitmq import RabbitMQ

TYPE_UNSUBSCRIBED = 0
TYPE_SUBSCRIBED = 1


def launch():
    load_dotenv()
    main()


def main():
    api_id = int(os.getenv('API_ID'))
    api_hash = os.getenv('API_HASH')
    session_key = StringSession(os.getenv('SESSION_KEY'))
    db = Database()

    with TelegramClient(session_key, api_id, api_hash) as client:
        channel = client.get_entity(os.getenv('CHANNEL_HANDLE'))

        id_to_start_with = db.get_max_event_id() + 1
        events = client.get_admin_log(channel, min_id=id_to_start_with)

        save_events(db, events)

    unprocessed_events = db.get_unprocessed_events()
    distribute_events(unprocessed_events)


def distribute_events(events: list):
    queue = RabbitMQ()
    for event in events:
        data = {
            'action_id': event[0],
            'action': event[3],
            'user_id': event[4],
            'username': event[5]
        }

        queue.publish(json.dumps(data))


def save_events(db: Database, events: list):
    for event in events:
        if event.joined or event.joined_by_invite:
            db.create_event(event.id, event.date, TYPE_SUBSCRIBED, event.user_id, event.user.username)
        elif event.left:
            db.create_event(event.id, event.date, TYPE_UNSUBSCRIBED, event.user_id, event.user.username)
