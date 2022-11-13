import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'
import { publish } from './amqp.js';

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (context) => {
    context.update.action = 'message'

    const data = JSON.stringify(context.update)

    console.log(data)

    await publish(data)
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));