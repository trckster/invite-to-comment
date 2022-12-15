import {Command} from "./command.js";
import {db} from "../services/db.js";
import {isValidTelegramUserId} from "../services/event-recognizer.js";
import {telegramApi} from "../services/telegram-api.js";

const MINUTES_UNTIL_OVERWRITE = 30

class InviteCommand extends Command {
    async process() {
        if (await db.hasActiveInvite(this.event.message.from.id)) {
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

        const invite = await db.getActiveInviteByInvitedId(invitedId)

        if (invite !== null) {
            if (this.isGuarded(invite)) {
                await this.respond(
                    'Кто-то уже пригласил этого пользователя, попробуйте другого!'
                )

                return
            }

            await this.overwriteInvite(invite)
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

        const invite = await db.getActiveInviteByInvitedUsername(username)

        if (invite !== null) {
            if (this.isGuarded(invite)) {
                await this.respond(
                    'Кто-то уже пригласил этого пользователя, попробуйте другого!'
                )

                return
            }

            await this.overwriteInvite(invite)
        }

        await db.createInviteByUsername(this.event.message.from.id, username)

        await this.inviteCreated()
    }

    async inviteCreated() {
        await this.respond('Приглашение создано ✅')
    }

    isGuarded(invite) {
        const guardEnd = invite.created_at.getTime() + MINUTES_UNTIL_OVERWRITE * 1000 * 60

        return guardEnd > Date.now()
    }

    async overwriteInvite(invite) {
        await telegramApi.sendMessage(
            invite.inviter_id,
            'Ваше последнее приглашение истекло, пользователь не подписался ⌛'
        )

        await db.markInviteAs(invite.id, 'overwritten')
    }
}

export {InviteCommand}