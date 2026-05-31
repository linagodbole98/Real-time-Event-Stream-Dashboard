import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { producer, TOPIC_ORDERS } from '../config/kafka';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send to Kafka
    await producer.send({
      topic: TOPIC_ORDERS,
      messages: [{ value: JSON.stringify(order) }],
    });

    res.status(201).json({ message: 'Order created & sent to Kafka', order });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};