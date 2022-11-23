import {Command} from "./command.js";
import {db} from "../services/db.js";
import {isValidTelegramUserId} from "../services/event-recognizer.js";

class InviteCommand extends Command {
    async process() {
        if (await db.hasActiveInvite()) {
            await this.respond(
                'У вас уже есть актвиное приглашение, чтобы его отменить, отправьте /cancel'
            )

            return
        }

        if (isValidTelegramUserId(this.event.message.text)) {
            await this.inviteById()
        } else {
            await this.inviteByHandle()
        }
    }

    async inviteById() {
        return await this.respond('Trying to invite by id')
        const invitedId = this.event.WHAT

        if (await db.alreadyInvitedById(invitedId)) {
            await this.respond(
                'Кто-то уже пригласил этого пользователя, попробуйте другого!'
            )

            return
        }

        await db.createInvite(/** TODO */)

        await this.inviteCreated()
    }

    async inviteByHandle() {
        return await this.respond('Trying to invite by handle')
        const username = this.event.message.text.substring(1)

        if (await db.alreadyInvitedByUsername(username)) {
            await this.respond(
                'Кто-то уже пригласил этого пользователя, попробуйте другого!'
            )

            return
        }

        await db.createInvite(/** TODO */)

        await this.inviteCreated()
    }

    async inviteCreated() {
        await this.respond('Приглашение создано. Даю 10 минут на подписку!')
    }
}

export {InviteCommand}