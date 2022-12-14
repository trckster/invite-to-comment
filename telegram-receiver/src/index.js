import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'
import { publish } from './amqp.js';

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async ({ update }) => {
    update.action = 'message'

    const data = JSON.stringify(update)

    log(data)

    await publish(data)
})

function log(message) {
    const now = new Date().toLocaleString()

    console.log(`[${now}]`, message)
}

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));