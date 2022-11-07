from datetime import datetime, timezone
import os
import psycopg2


class Database:
    def __init__(self):
        self.connection = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
        )
        self.cursor = self.connection.cursor()

    def commit(self):
        self.connection.commit()

    def get_max_event_id(self):
        self.cursor.execute('SELECT MAX(telegram_event_id) FROM events;')
        result = self.cursor.fetchone()

        return result[0] or 0

    def create_event(self, id: int, happened_at: datetime, type: str, user_id: int, username: str = None):
        self.cursor.execute('INSERT INTO events (telegram_event_id, happened_at, type, user_id, username)' +
                            'VALUES (%s, %s, %s, %s, %s)', (id, happened_at, type, user_id, username))
        self.commit()

    def get_unprocessed_events(self):
        self.cursor.execute('SELECT * FROM events WHERE processed_at IS NULL;')

        return self.cursor.fetchall()

    def __del__(self):
        self.cursor.close()
        self.connection.close()
