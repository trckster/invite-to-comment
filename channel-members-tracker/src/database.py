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

        self.create_tables()

    def get_cursor(self):
        return self.connection.cursor()

    def commit(self):
        self.connection.commit()

    def create_tables(self):
        cursor = self.get_cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS events (
            id BIGINT PRIMARY KEY,
            happened_at TIMESTAMP NOT NULL,
            action SMALLINT NOT NULL,
            user_id BIGINT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );''')
        self.commit()
