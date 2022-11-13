import {Command} from "./command.js";

class GetIdCommand extends Command {
    async process() {
        const userId = this.event.message.from.id

        await this.respond(`Ваш ID: ${userId}`)
    }
}

export {GetIdCommand}
