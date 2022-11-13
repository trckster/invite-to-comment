import {Command} from "./command.js";
import {telegramApi} from "../services/telegram-api.js";

class ReportCommand extends Command {
    async process() {
        const realText = this.event.message.text
            .split(' ')
            .slice(1)
            .filter(word => word !== '')
            .join(' ')

        if (realText === '') {
            await this.respond('/report дальше надо написать свой текст')
        } else {
            // TODO remove /report and add username with id
            await telegramApi.sendToAdmin(this.event.message.text)
            await this.respond('Передал 👍')
        }
    }
}

export {ReportCommand}