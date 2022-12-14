import {Command} from "./command.js";
import {db} from "../services/db.js";

class CancelCommand extends Command {
    async process() {
        const invite = await db.getActiveInviteByInviterId(this.event.message.from.id)

        if (invite === null) {
            await this.respond('У вас нет активного приглашения')

            return
        }

        await db.markInviteAs(invite.id, 'cancelled')

        await this.respond('Текущее приглашение отменено ❌')
    }
}

export {CancelCommand}