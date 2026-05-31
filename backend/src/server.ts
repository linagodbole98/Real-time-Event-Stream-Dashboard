import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { producer } from './config/kafka';
import { startConsumer } from './kafka/consumer';
import { initSocket } from './sockets/socket';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);

// Initialize Socket.io
initSocket(httpServer);

const start = async () => {
  await mongoose.connect('mongodb://localhost:27017/mern-kafka');
  await producer.connect();
  await startConsumer();

  httpServer.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
    console.log('📡 Socket.io + Kafka Real-time enabled');
  });
};

start();