import { Telegraf } from 'telegraf';

const bot = new Telegraf('');

bot.command('ping', async (ctx) => {
    await ctx.reply(`pong`);
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));