from datetime import datetime, timezone
import json
import os
from telethon import TelegramClient, sync, errors
from telethon.sessions import StringSession
from dotenv import load_dotenv
from src.database import Database
from src.rabbitmq import RabbitMQ

TYPE_SUBSCRIBED = 'subscribed'
TYPE_UNSUBSCRIBED = 'unsubscribed'


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

        try:
            events = client.get_admin_log(channel, min_id=id_to_start_with)
        except errors.FloodError as e:
            log('FloodError occurred')

            queue = RabbitMQ()
            queue.publish(json.dumps({
                'action': 'error',
                'message': 'Flood error occurred'
            }))

            raise e

        save_events(db, events)

    unprocessed_events = db.get_unprocessed_events()
    distribute_events(unprocessed_events)


def distribute_events(events: list):
    queue = RabbitMQ()
    for event in events:
        data = {
            'action_id': event[0],
            'action': event[4],
            'user_id': event[5],
            'username': event[6]
        }

        queue.publish(json.dumps(data))


def save_events(db: Database, events: list):
    log('New events count: %d' % len(events))

    for event in events:
        if event.joined or event.joined_by_invite:
            event_type = TYPE_SUBSCRIBED
        elif event.left:
            event_type = TYPE_UNSUBSCRIBED
        else:
            continue

        log(f'{event.user_id} ({event.user.username}): {event_type}')
        db.create_event(event.id, event.date, event_type, event.user_id, event.user.username)


def log(message: str):
    time = datetime.now(timezone.utc)

    print(f'[{time}] {message}')
