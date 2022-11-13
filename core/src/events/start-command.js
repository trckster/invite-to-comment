import {Command} from "./command.js";
import {db} from "../services/db.js";

function getStartText() {
    return 'Чтобы пригласить друга в канал @' + process.env.CHANNEL_HANDLE + ', ' +
        'отправьте его @юзернейм или ID.'
}

class StartCommand extends Command {
    async process() {
        if (await db.isChatMember(/** TODO */)) {
            await this.respond('У тебя уже есть доступ к комментариям!')
        } else {
            await this.respond(getStartText())
        }
    }
}

export {StartCommand, getStartText}