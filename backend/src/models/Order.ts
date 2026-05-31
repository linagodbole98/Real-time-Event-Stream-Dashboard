import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: String,
  product: String,
  quantity: Number,
  amount: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model('Order', orderSchema);