import sys
from rabbitmq import RabbitMQ
from dotenv import load_dotenv


def callback_example(ch, method, props, body):
    print("[x] Received %r" % body)


def main():
    load_dotenv()

    queue = RabbitMQ()

    queue.consume(callback_example)


try:
    main()
except KeyboardInterrupt:
    print('Interrupted')
    sys.exit(0)
