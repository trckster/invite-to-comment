import {Command} from "./command.js";

function getStartText() {
    return 'Чтобы пригласить друга в канал @' + process.env.CHANNEL_HANDLE + ', ' +
        'отправьте его @юзернейм или ID. Больше информации: /help'
}

class StartCommand extends Command {
    async process() {
        await this.respond(getStartText())
    }
}

export {StartCommand, getStartText}