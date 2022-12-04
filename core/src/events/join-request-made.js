import {AppEvent} from "./app-event.js";
import {getStartText} from "./start-command.js";
import {telegramApi} from "../services/telegram-api.js";
import {db} from "../services/db.js";

class JoinRequestMade extends AppEvent {
    async process() {
        const userId = this.event.chat_join_request.from.id

        const lives =  await db.getSuccessfulInvitesCount(userId)

        if (lives > 0) {
            await telegramApi.acceptJoinRequest(userId)
        } else {
            await telegramApi.sendMessage(userId, getStartText())
        }
    }
}

export {JoinRequestMade}