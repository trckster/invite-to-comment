from json import loads
from src.logger import log
from src.admin_log_processor import AdminLogProcessor


def receive_command(ch, method, props, body):
    data = loads(body)

    if data['command'] == 'check-admin-log':
        if data['invitedId'] is None:
            data['invitedId'] = -1

        processor = AdminLogProcessor({
            'chat_id': int(data['chatId']),
            'invited_id': int(data['invitedId']),
            'invited_username': data['invitedUsername']
        })

        processor.run()
    else:
        log('Unknown command: %s' % data['command'])
