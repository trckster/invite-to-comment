import {AppEvent} from "./app-event.js";
import {db} from "../services/db.js";

class UserSubscribed extends AppEvent {
    async process() {
        // TODO If we detect a subscription by invite, we should make only one invite successful (if user was invited by 2 users using id and username)

        await db.markEventAsProcessed(this.event.action_id)
    }
}

export {UserSubscribed}