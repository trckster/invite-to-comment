import {Command} from "./command.js";
import {publish} from "../services/amqp.js";

class CheckCommand extends Command {
    async process() {
        // has active invites?
        // last request was sent more than a minute ago?

        await this.respond('Проверяем ♻')

        await publish(JSON.stringify({
            data: 'Some useful information'
        }), 'mtproto-requests')
    }
}

export {CheckCommand}