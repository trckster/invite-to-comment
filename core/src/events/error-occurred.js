import {AppEvent} from "./app-event.js";
import {telegramApi} from "../services/telegram-api.js";

class ErrorOccurred extends AppEvent {
    async process() {
        await telegramApi.sendToAdmin(this.event.message)
    }
}

export {ErrorOccurred}