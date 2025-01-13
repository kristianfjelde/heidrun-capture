const { connect } = require('amqplib');

async function send(processData = {}) {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    const queueName = process.env.RABBITMQ_QUEUE_NAME;

    if (!rabbitmqUrl || !queueName) {
      throw new Error('RABBITMQ_URL or RABBITMQ_QUEUE_NAME environment variable is not set');
    }

    const connection = await connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    const message = {
      payload: processData,
      external_id: 'heidrun',
      time: Date.now(),
      type: 'new_data'
    }

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`Message sent to queue "${queueName}":`, processData);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.warn('Error sending data to queue:', error);
  }
}

module.exports = { send };

/*

Telenor IoT complete payload example:

{
  "deviceId": "85KYHAL4CQ73KX9LED",
  "networkThingId": null,
  "thingType": null,
  "subscriptionId": "85KYHAL4CQ73KX9LED",
  "sentDate": null,
  "receivedDate": "2025-01-13T10:13:22.3951422+01:00",
  "protocol": "WebSocket",
  "payload": "{\"Chiller\":false,\"FV1_Temp\":199,\"HLT_Temp\":36,\"FV2_Temp\":200,\"Kettle_Temp\":55,\"FV1_SetTemp\":20,\"FV2_SetTemp\":20,\"HLT_Level\":-23,\"Test\":0}",
  "topic": null
}

 */