import os
import pika


class RabbitMQ:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv('RABBITMQ_HOST')))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='events', durable=True)
        self.channel.queue_declare(queue='mtproto-requests', durable=True)

    def publish(self, data):
        self.channel.basic_publish(exchange='', routing_key='events', body=data)

    def consume(self, callback):
        self.channel.basic_consume(queue='mtproto-requests', on_message_callback=callback, auto_ack=True)
        self.channel.start_consuming()

    def close_connection(self):
        self.connection.close()
