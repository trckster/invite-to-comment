import * as amqp from 'amqplib'

async function publish(data) {
    const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
    const channel = await connection.createChannel()
    await channel.assertQueue('main', {
        durable: false
    })
    await channel.sendToQueue('main', Buffer.from(data))
    await channel.close()
    await connection.close()
}

export {publish}