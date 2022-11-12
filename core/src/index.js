import * as dotenv from 'dotenv'
import {telegramApi} from "./services/telegram-api.js"
import {recognizeEvent} from "./services/event-recognizer.js";
import {startConsuming} from "./services/amqp.js"

dotenv.config()

await startConsuming('main', async function (message) {
    const event = JSON.parse(message.content.toString())

    const eventHandler = recognizeEvent(event)
    await eventHandler.process()

    await telegramApi.sendToAdmin(event)
})
