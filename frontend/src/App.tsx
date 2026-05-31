import { useState } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import React from 'react';

function App() {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const createOrder = async () => {
    if (!product) return alert("Enter product name");

    await axios.post('http://localhost:5000/api/orders', {
      userId: 'user123',
      product,
      quantity,
      amount: quantity * 99,
      status: 'pending'
    });

    alert('Order Created & Sent to Kafka!');
    setProduct('');
  };

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* Left: Order Form */}
      <div style={{ width: '300px' }}>
        <h2>Create New Order</h2>
        <input
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <button onClick={createOrder} style={{ width: '100%', padding: '12px' }}>
          Send Order to Kafka
        </button>
      </div>

      {/* Right: Real-time Dashboard */}
      <div style={{ flex: 1 }}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;