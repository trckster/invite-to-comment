from json import loads
from src.logger import log
from src.admin_log_processor import AdminLogProcessor


def receive_command(ch, method, props, body):
    data = loads(body)

    if data['command'] == 'check-admin-log':
        processor = AdminLogProcessor(data['chatId'])
        processor.run()
    else:
        log('Unknown command: %s' % data['command'])
