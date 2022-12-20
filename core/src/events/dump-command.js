import {Command} from "./command.js";
import {telegramApi} from "../services/telegram-api.js";

class DumpCommand extends Command {
    async process() {
        await telegramApi.sendToAdmin(JSON.stringify(this.event))
    }
}

export {DumpCommand}