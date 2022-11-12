import {telegramApi} from "../services/telegram-api.js";
import {AppEvent} from "./app-event.js";

class Command extends AppEvent {
    constructor(event) {
        super(event);
        this.chatId = event.message.chat.id
    }

    async respond(message) {
        await telegramApi.sendMessage(this.chatId, message)
    }
}

export {Command}