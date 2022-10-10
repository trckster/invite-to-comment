import datetime
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
        self.create_tables()

    def commit(self):
        self.connection.commit()

    def create_tables(self):
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS events (
            id BIGINT PRIMARY KEY,
            happened_at TIMESTAMP NOT NULL,
            processed_at TIMESTAMP,
            type SMALLINT NOT NULL,
            user_id BIGINT NOT NULL,
            username VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );''')
        self.commit()

    def get_max_event_id(self):
        self.cursor.execute('SELECT MAX(id) FROM events;')
        result = self.cursor.fetchone()

        return result[0] or 0

    def create_event(self, id: int, happened_at: datetime, type: int, user_id: int, username: str = None):
        self.cursor.execute('INSERT INTO events (id, happened_at, type, user_id, username)' +
                            'VALUES (%s, %s, %s, %s, %s)', (id, happened_at, type, user_id, username))
        self.commit()
