import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'mern-app',
  brokers: ['localhost:9092'], // Change for production
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'mern-group' });

export const TOPIC_ORDERS = 'orders-topic';