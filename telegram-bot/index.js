import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('ping', async (ctx) => {
    await ctx.reply('pong');
})

bot.on('chat_join_request', async (ctx) => {

    console.log(ctx)
    console.log('works')
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));