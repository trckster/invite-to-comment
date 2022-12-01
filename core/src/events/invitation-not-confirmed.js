import {AppEvent} from "./app-event.js";
import {telegramApi} from "../services/telegram-api.js";

class InvitationNotConfirmed extends AppEvent {
    async process() {
        await telegramApi.sendMessage(this.event.chatId, 'Приглашенный пользователь ещё не подписался 🔄')
    }
}

export {InvitationNotConfirmed}