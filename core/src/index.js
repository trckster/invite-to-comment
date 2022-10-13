import * as dotenv from 'dotenv'
import * as amqp from 'amqplib'
import { Telegraf } from 'telegraf';

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);

const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
const channel = await connection.createChannel()
await channel.assertQueue('main')

channel.consume('main', processMessage, {
    noAck: true
});

function processMessage(message) {
    const event = message.content.toString()

    bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, event)
}
