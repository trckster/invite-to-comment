import {AppEvent} from "./app-event.js";
import {db} from "../services/db.js";

class UserSubscribed extends AppEvent {
    async process() {
        await db.markEventAsProcessed(this.event.action_id)
    }
}

export {UserSubscribed}