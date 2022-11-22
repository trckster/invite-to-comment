import os
import pika


class RabbitMQ:
    def __init__(self, queue):
        self.queue = queue
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv('RABBITMQ_HOST')))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue, durable=True)

    def publish(self, data):
        self.channel.basic_publish(exchange='', routing_key=self.queue, body=data)

    def consume(self, callback):
        self.channel.basic_consume(queue=self.queue, on_message_callback=callback, auto_ack=True)
        self.channel.start_consuming()

    def close_connection(self):
        self.connection.close()

    def __del__(self):
        self.close_connection()
