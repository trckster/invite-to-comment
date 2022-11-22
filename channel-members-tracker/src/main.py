from dotenv import load_dotenv
from src.rabbitmq import RabbitMQ
from src.consumer import receive_command
from src.admin_log_processor import AdminLogProcessor


def launch():
    load_dotenv()

    processor = AdminLogProcessor()
    processor.run()


def consume():
    load_dotenv()

    queue = RabbitMQ('mtproto-requests')
    queue.consume(receive_command)
