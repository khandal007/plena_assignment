const amqp = require('amqplib');

async function connect() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('task_completed');
  return channel;
}

module.exports = connect;
