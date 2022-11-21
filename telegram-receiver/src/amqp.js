import * as amqp from 'amqplib'

async function publish(data) {
    const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
    const channel = await connection.createChannel()
    await channel.assertQueue('events')
    await channel.sendToQueue('events', Buffer.from(data))
}

export {publish}