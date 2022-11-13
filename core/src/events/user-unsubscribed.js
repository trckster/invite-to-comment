import {AppEvent} from "./app-event.js";
import {db} from "../services/db.js";

class UserUnsubscribed extends AppEvent {
    async process() {
        await db.markEventAsProcessed(this.event.action_id)
    }
}

export {UserUnsubscribed}