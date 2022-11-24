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
        const invitedId = +this.event.message.text

        if (await db.wasSubscribedCheckById(invitedId)) {
            await this.respond(
                'Пользователь с таким ID уже был когда-то подписан на канал, пожалуйста, выберите другого!'
            )

            return
        }

        if (await db.alreadyInvitedById(invitedId)) {
            await this.respond(
                'Кто-то уже пригласил этого пользователя, попробуйте другого!'
            )

            return
        }

        await db.createInviteById(this.event.message.from.id, invitedId)

        await this.inviteCreated()
    }

    async inviteByHandle() {
        const username = this.event.message.text.substring(1)

        if (await db.wasSubscribedCheckByUsername(username)) {
            await this.respond(
                'Пользователь с таким юзернеймом уже был когда-то подписан на канал, пожалуйста, выберите другого!'
            )

            return
        }

        if (await db.alreadyInvitedByUsername(username)) {
            await this.respond(
                'Кто-то уже пригласил этого пользователя, попробуйте другого!'
            )

            return
        }

        await db.createInviteByUsername(this.event.message.from.id, username)

        await this.inviteCreated()
    }

    // TODO Think about infinite user lock
    async inviteCreated() {
        await this.respond('Приглашение создано ✅')
    }
}

export {InviteCommand}