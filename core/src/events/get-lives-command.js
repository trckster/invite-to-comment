import {Command} from "./command.js";
import {db} from "../services/db.js";

class GetLivesCommand extends Command {
    async process() {
        const userId = this.event.message.from.id

        const livesCount = await db.getSuccessfulInvitesCount(userId)

        await this.respond(`Кол-во жизней: ${livesCount}`)
    }
}

export {GetLivesCommand}
