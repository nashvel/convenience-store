import React, { useState, useEffect, useCallback, useRef } from 'react';
import PhilippinesMap from '../components/PhilippinesMap';
import MapSkeleton from '../skeletons/MapSkeleton';
import api from '../../api/axios-config';
import { useAuth } from '../../context/AuthContext';
import OrderListSkeleton from '../skeletons/OrderListSkeleton';
import toast, { Toaster } from 'react-hot-toast';

const ActiveOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapDirectionsRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    if (!user || !user.id) return;

    setLoading(true);
    try {
      const response = await api.get(`/orders?rider_id=${user.id}&status=accepted,in_transit`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch active orders', error);
      toast.error('Failed to fetch active orders.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user, fetchOrders]);

  const handleStartDelivery = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found.');
      return;
    }

    const promise = api.post(`/orders/${orderId}/start-delivery`);

    toast.promise(promise, {
      loading: 'Starting delivery...',
      success: (res) => {
        fetchOrders();
        if (mapDirectionsRef.current && order.customer_latitude && order.customer_longitude) {
          mapDirectionsRef.current([order.customer_latitude, order.customer_longitude]);
        }
        return res.data.message || 'Delivery started successfully!';
      },
      error: (err) => err.response?.data?.message || 'Failed to start delivery.',
    });
  };

  const handleCancelDelivery = async (orderId, reason) => {
    const promise = api.post(`/orders/${orderId}/cancel-delivery`, { reason });

    toast.promise(promise, {
      loading: 'Cancelling delivery...',
      success: (res) => {
        fetchOrders(); // Refresh the list
        return res.data.message || 'Delivery cancelled successfully!';
      },
      error: (err) => err.response?.data?.message || 'Failed to cancel delivery.',
    });
  };

  return (
    <div className="h-full w-full relative">
      <Toaster position="top-center" reverseOrder={false} />
      <PhilippinesMap 
        orders={orders} 
        defaultZoom={15}
        onStartDelivery={handleStartDelivery}
        onCancelDelivery={handleCancelDelivery}
        directionsRef={mapDirectionsRef}
      />
      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
          <div className="flex flex-col lg:flex-row h-full w-full">
            <div className="lg:w-3/5 h-1/2 lg:h-full"><MapSkeleton /></div>
            <div className="lg:w-2/5 h-1/2 lg:h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Active Orders</h2>
              <OrderListSkeleton count={3} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
