import {Command} from "./command.js";

class PingCommand extends Command {
    async process() {
        await this.respond('pong')
    }
}

export {PingCommand}