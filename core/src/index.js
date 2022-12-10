import * as dotenv from 'dotenv'
import {telegramApi} from "./services/telegram-api.js"
import {recognizeEvent} from "./services/event-recognizer.js";
import {startConsuming} from "./services/amqp.js"

dotenv.config()

BigInt.prototype.toJSON = function () {
    return this.toString()
}


await startConsuming('events', async function (message) {
    const event = JSON.parse(message.content.toString())

    log(event)

    try {
        const eventHandler = recognizeEvent(event)

        if (eventHandler) {
            await eventHandler.process()
        }
    } catch (error) {
        log(error)

        await telegramApi.sendToAdmin(JSON.stringify(event))
        await telegramApi.sendToAdmin('Error happened: ' + error.toString())
    }
})

function log(message, data = '') {
    const now = new Date().toLocaleString()

    console.log(`[${now}]`, message, data)
}

export {log}