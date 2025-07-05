import React from 'react';
import OrderCard from '../components/OrderCard';

const ActiveOrders = ({ activeOrders }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">My Active Orders ({activeOrders.length})</h2>
      {activeOrders.length > 0 ? (
        <div className="space-y-6">
          {activeOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          <p>You have no active orders. Go to the dashboard to find new ones!</p>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
