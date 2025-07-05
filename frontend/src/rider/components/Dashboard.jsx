import React, { useState, useEffect } from 'react';
import { getAvailableOrders } from '../../api/riderApi';
import OrderCard from '../components/OrderCard';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailableOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading available orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Orders</h2>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No available orders at the moment.</p>
      )}
    </div>
  );
};

export default Dashboard;
