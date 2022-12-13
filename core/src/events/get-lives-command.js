import {Command} from "./command.js";
import {db} from "../services/db.js";

class GetLivesCommand extends Command {
    async process() {
        const userId = this.event.message.from.id

        const livesCount = await db.getSuccessfulInvitesCount(userId)

        let emoji
        if (livesCount > 0) {
            emoji = '❤'.repeat(livesCount)
        } else {
            emoji = '💔'
        }

        await this.respond(
            `Кол-во жизней: ${livesCount}\n${emoji}`
        )

        // TODO:non-mvp add list of invited users
    }
}

export {GetLivesCommand}
