import React, { useState, useEffect } from 'react';
import PhilippinesMap from '../components/PhilippinesMap';
import MapSkeleton from '../skeletons/MapSkeleton';
import api from '../../api/axios-config';
import { useAuth } from '../../context/AuthContext';
import OrderListSkeleton from '../skeletons/OrderListSkeleton';

const ActiveOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/orders?rider_id=${user.id}`);
      if (response.data.success) {
        const activeDeliveries = response.data.orders.filter(
          order => order.status === 'accepted' || order.status === 'in_transit'
        );
        setOrders(activeDeliveries);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch active orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        <div className="lg:w-3/5 h-1/2 lg:h-full">
          <MapSkeleton />
        </div>
        <div className="lg:w-2/5 h-1/2 lg:h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Active Orders</h2>
          <OrderListSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <PhilippinesMap orders={orders} defaultZoom={15} />
    </div>
  );
};

export default ActiveOrders;
