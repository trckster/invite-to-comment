import {Command} from "./command.js";
import {publish} from "../services/amqp.js";

class CheckCommand extends Command {
    async process() {
        // has active invites?
        // last request was sent more than a minute ago?

        await this.respond('Проверяем ♻')

        await publish(JSON.stringify({
            command: 'check-admin-log',
            chatId: this.chatId
        }), 'mtproto-requests')
    }
}

export {CheckCommand}