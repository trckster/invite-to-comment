import {AppEvent} from "./app-event.js";
import {db} from "../services/db.js";
import {telegramApi} from "../services/telegram-api.js";
import {log} from "../index.js"

class UserSubscribed extends AppEvent {
    async process() {
        await db.saveNewSubscriber(this.event.user_id, this.event.username)

        const activeInvite = await db.getActiveInviteBySubscription(this.event.user_id, this.event.username)

        if (activeInvite === null) {
            await db.markEventAsProcessed(this.event.action_id)

            return
        }

        log('Successful invitation: ', activeInvite)
        await db.markInviteAs(activeInvite.id, 'successful')

        let user
        if (this.event.username) {
            user = '@' + this.event.username;
        } else {
            user = this.event.user_id
        }

        await telegramApi.sendMessage(
            activeInvite.inviter_id,
            `Пользователь ${user} подписался по вашему приглашению! 🎆`
        )

        // TODO check, that every command works good with username=undefined
        await db.updateOtherInvitesOfThisUserAsDuplicate(this.event.user_id, this.event.username)

        try {
            await telegramApi.acceptJoinRequest(activeInvite.inviter_id)
        } catch (error) {
            log('Failed accepting join request')
        }

        await db.markEventAsProcessed(this.event.action_id)
    }
}

export {UserSubscribed}