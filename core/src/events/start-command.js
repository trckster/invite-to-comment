import {Command} from "./command.js";

function getStartText() {
    return 'Привет! Это чатбот канала @' + process.env.CHANNEL_HANDLE + ', ' +
        'чтобы получить доступ к комментариям, пригласите в этот канал друга. ' +
        'Отправьте его @юзернейм или ID (/id).\n' +
        'Больше информации: /help'
}

class StartCommand extends Command {
    async process() {
        await this.respond(getStartText())
    }
}

export {StartCommand, getStartText}