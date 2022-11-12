import {Command} from "./command.js";
import {db} from "../services/db.js";

class InviteCommand extends Command {
    async process() {
        // TODO check forward is recognizable

        if (await db.hasActiveInvite()) {
            await this.respond(
                'У вас уже есть актвиное приглашение, чтобы его отменить, пришлите /cancel'
            )

            return
        }

        if (true/** TODO Is forward? */) {
            await this.inviteByForward()
        } else {
            await this.inviteByHandle()
        }
    }

    async inviteByForward() {
        const invitedId = this.event.WHAT

        if (await db.wasSubscriber(invitedId)) {
            await this.respond(
                'Этот пользователь уже был когда-то подписан на канал, попробуйте другого!'
            )

            return
        }

        if (await db.alreadyInvitedByForward(invitedId)) {
            await this.respond(
                'Кто-то уже пригласил этого пользователя, попробуйте другого!'
            )

            return
        }

        await db.createInvite(/** TODO */)

        await this.inviteCreated()
    }

    async inviteByHandle() {
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