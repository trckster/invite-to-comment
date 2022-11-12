import * as amqp from "amqplib";

async function startConsuming(queue, handler) {
    const connection = await amqp.connect('amqp://' + process.env.RABBITMQ_HOST)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)

    channel.consume(queue, handler, {
        noAck: true
    });
}

export {startConsuming}