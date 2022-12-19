import {AppEvent} from "./app-event.js";
import {db} from "../services/db.js";
import {telegramApi} from "../services/telegram-api.js";

class UserUnsubscribed extends AppEvent {
    async process() {
        await db.markEventAsProcessed(this.event.action_id)

        const invite = await db.getSuccessfulInvitationByInvited(this.event.user_id, this.event.username)

        if (invite === null) {
            return
        }

        await db.markInviteAs(invite.id, 'revoked')

        const lives = await db.getSuccessfulInvitesCount(invite.inviter_id)

        let message = 'От канала отписался приглашённый вами пользователь '

        if (this.event.username) {
            message += '@' + this.event.username
        } else {
            message += 'c ID ' + this.event.user_id
        }

        if (lives < 1) {
            message += '. У вас осталось 0 жизней, поэтому вам нужно пригласить кого-то ещё ' +
                'чтобы снова получить доступ к комментариям!'
        } else {
            message += `. Количество оставшихся жизней: ${lives}.`
        }

        if (lives < 1) {
            try {
                await telegramApi.kickFromGroup(invite.inviter_id)
            } catch (error) {
            }
        }

        await telegramApi.sendMessage(invite.inviter_id, message)
    }
}

export {UserUnsubscribed}