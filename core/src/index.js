import * as dotenv from 'dotenv'
import {telegramApi} from "./services/telegram-api.js"
import {recognizeEvent} from "./services/event-recognizer.js";
import {startConsuming} from "./services/amqp.js"

dotenv.config()

await startConsuming('events', async function (message) {
    const event = JSON.parse(message.content.toString())

    log(event)

    const eventHandler = recognizeEvent(event)
    await eventHandler.process()

    await telegramApi.sendToAdmin(JSON.stringify(event))
})

function log(message) {
    const now = new Date().toLocaleString()

    console.log(`[${now}]`, message)
}