import json
from dotenv import load_dotenv
from src.database import Database
from src.rabbitmq import RabbitMQ
from src.mtproto import TelegramAPI
from src.logger import log
from json import dumps
from telethon import errors

TYPE_SUBSCRIBED = 'subscribed'
TYPE_UNSUBSCRIBED = 'unsubscribed'


def launch():
    load_dotenv()
    main()


def main():
    db = Database()

    id_to_start_with = db.get_max_event_id() + 1

    api = TelegramAPI()

    try:
        events = api.fetch_updates_starting_with(id_to_start_with)
    except errors.FloodError as e:
        log('FloodError occurred')

        queue = RabbitMQ()
        queue.publish(dumps({
            'action': 'error',
            'message': 'Flood error occurred'
        }))
        queue.close_connection()

        raise e

    db.save_request()
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

    queue.close_connection()


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
