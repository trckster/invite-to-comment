import * as amqp from "amqplib";

async function startConsuming(queue, handler) {
    const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)

    channel.consume(queue, handler, {
        noAck: true
    });
}

async function publish(data, channelName) {
    const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
    const channel = await connection.createChannel()
    await channel.assertQueue(channelName)
    await channel.sendToQueue(channelName, Buffer.from(data))
}


export {startConsuming, publish}