import {Command} from "./command.js";

class CheckCommand extends Command {
    async process() {
        // has active invites?
        // last request was sent more than a minute ago?

        await this.respond('Проверяем ♻')
        // send to queue
    }
}

export {CheckCommand}