import os
import pika


class RabbitMQ:
    def __init__(self):
        connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv('RABBITMQ_HOST')))
        self.channel = connection.channel()
        self.channel.queue_declare(queue='main')

    def publish(self, data):
        self.channel.basic_publish(exchange='', routing_key='main', body=data)

    def __del__(self):
        self.channel.close()
