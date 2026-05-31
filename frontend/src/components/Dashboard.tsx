import React from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

interface Order {
  _id: string;
  userId: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [events, setEvents] = useState<Order[]>([]);

  useEffect(() => {
    socket.on('kafka-event', (event) => {
      if (event.type === 'NEW_ORDER') {
        setEvents(prev => [event.data, ...prev].slice(0, 50)); // Keep latest 50
      }
    });

    return () => {
      socket.off('kafka-event');
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Real-time Kafka Event Stream Dashboard</h1>
      <p><strong>Live Orders from Kafka Topic:</strong> orders-topic</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Live Events ({events.length})</h2>
        <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th>Time</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((order, index) => (
              <tr key={order._id || index}>
                <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                <td><strong>{order.product}</strong></td>
                <td>{order.quantity}</td>
                <td>₹{order.amount}</td>
                <td style={{ color: order.status === 'pending' ? 'orange' : 'green' }}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && <p>No events yet. Create an order from the form.</p>}
      </div>
    </div>
  );
}