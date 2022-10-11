import * as dotenv from 'dotenv'
import * as amqp from 'amqplib'

dotenv.config()

const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
const channel = await connection.createChannel()
await channel.assertQueue('main')

channel.consume('main', function (msg) {
    console.log(msg.content.toString());
}, {
    noAck: true
});
