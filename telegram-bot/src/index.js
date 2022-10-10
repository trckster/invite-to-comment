import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'
import { publish } from './amqp.js';

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (context) => {
    console.log(JSON.stringify(context.update))

    await publish(JSON.stringify(context.update))
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));