import { consumer, TOPIC_ORDERS } from '../config/kafka';
import { emitKafkaEvent } from '../sockets/socket';

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_ORDERS, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }:any) => {
      const value = message.value?.toString();
      if (!value) return;

      try {
        const order = JSON.parse(value);
        console.log(`📥 Kafka Received:`, order);

        // Emit to all connected clients in real-time
        emitKafkaEvent({
          type: 'NEW_ORDER',
          data: order,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error processing Kafka message:', err);
      }
    },
  });
};