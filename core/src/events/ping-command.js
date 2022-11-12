import {Command} from "./command.js";

class PingCommand extends Command {
    async process() {
        this.respond('pong')
    }
}

export {PingCommand}