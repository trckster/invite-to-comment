from src.database import Database
from src.mtproto import TelegramAPI
from src.rabbitmq import RabbitMQ
from src.logger import log
from telethon import errors
from json import dumps

TYPE_SUBSCRIBED = 'subscribed'
TYPE_UNSUBSCRIBED = 'unsubscribed'


class AdminLogProcessor:
    def __init__(self, initiator=None):
        self.initiator = initiator

        self.db = Database()
        self.mtproto = TelegramAPI()
        self.queue = RabbitMQ('events')

    def report_flood_error(self):
        log('FloodError occurred')

        self.queue.publish(dumps({
            'action': 'error',
            'message': 'Flood error occurred'
        }))

    def run(self):
        id_to_start_with = self.db.get_max_event_id() + 1
        try:
            events = self.mtproto.fetch_updates_starting_with(id_to_start_with)
        except errors.FloodError as e:
            self.report_flood_error()

            raise e
        # TODO Exclude paired events

        self.db.save_request()
        self.save_events(events)

        unprocessed_events = self.db.get_unprocessed_events()
        self.distribute_events(unprocessed_events)

    def distribute_events(self, events: list):
        for event in events:
            data = {
                'action_id': event[0],
                'action': event[4],
                'user_id': event[5],
                'username': event[6],
                'initiator': self.initiator
            }

            self.queue.publish(dumps(data))

    def save_events(self, events: list):
        events_count = 0

        for event in events:
            if event.joined or event.joined_by_invite:
                event_type = TYPE_SUBSCRIBED
            elif event.left:
                event_type = TYPE_UNSUBSCRIBED
            else:
                continue

            events_count += 1

            log(f'{event.user_id} ({event.user.username}): {event_type}')

            self.db.create_event(event.id, event.date, event_type, event.user_id, event.user.username)

        log(f'New events count: {events_count}')
