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
            await this.respond('Usage: /report <your information here>')
        } else {
            const reporter = this.event.message.from

            const message = '⚡ New Report ⚡\n\n' +
                `ID: ${reporter.id}\n` +
                `Name: ${reporter.first_name}\n` +
                `Username: ${reporter.username}\n` +
                `Message: ${realText}`

            await telegramApi.sendToAdmin(message)

            await this.respond('Передал 👍')
        }
    }
}

export {ReportCommand}