import {AppEvent} from "./app-event.js";
import {getStartText, StartCommand} from "./start-command.js";
import {telegramApi} from "../services/telegram-api.js";

class JoinRequestMade extends AppEvent {
    async process() {
        const userId = this.event.HERE // TODO

        // TODO how to start chat with user
        await telegramApi.sendMessage(userId, getStartText())
    }
}

export {JoinRequestMade}