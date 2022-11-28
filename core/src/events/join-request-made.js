import {AppEvent} from "./app-event.js";
import {getStartText} from "./start-command.js";
import {telegramApi} from "../services/telegram-api.js";

class JoinRequestMade extends AppEvent {
    async process() {
        const userId = this.event.chat_join_request.from.id

        await telegramApi.sendMessage(userId, getStartText())
    }
}

export {JoinRequestMade}