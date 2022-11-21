import sys
from rabbitmq import RabbitMQ
from dotenv import load_dotenv
from json import loads
from logger import log
from admin_log_processor import AdminLogProcessor


def receive_command(ch, method, props, body):
    data = loads(body)

    if data['command'] == 'check-admin-log':
        processor = AdminLogProcessor(data['chatId'])
        processor.run()
    else:
        log('Unknown command: %s' % data['command'])


def main():
    load_dotenv()

    queue = RabbitMQ()
    queue.consume(receive_command)


try:
    main()
except KeyboardInterrupt:
    print('Interrupted')
    sys.exit(0)
