import {Command} from "./command.js";

class UnknownCommand extends Command {
    async process() {
        await this.respond('Не понимаю, попробуйте /help')
    }
}

export {UnknownCommand}