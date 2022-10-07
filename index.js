import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('ping', async (ctx) => {
    await ctx.reply(`pong`);
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));