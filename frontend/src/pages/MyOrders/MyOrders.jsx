import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PRODUCT_ASSET_URL } from '../../config';
import CancelOrderModal from '../../components/Modals/CancelOrderModal';
import MyOrderDetailSkeleton from '../../components/Skeletons/MyOrderDetailSkeleton';

const MyOrders = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to fetch order details.');
        }
      } catch (err) {
        setError('An error occurred while fetching order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  const handleConfirmCancel = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/cancel/${id}`);
      if (response.data.success) {
        setOrder({ ...order, status: 'cancelled' });
      } else {
        setError('Failed to cancel order.');
      }
    } catch (err) {
      setError('An error occurred while cancelling the order.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-indigo-500';
      case 'rejected':
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <MyOrderDetailSkeleton />;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!order) return <p className="text-center mt-20">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto my-20 p-8 bg-white rounded-xl shadow-lg">
      <Link to="/my-orders" className="inline-block mb-6 px-4 py-2 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 transition">
        ← Back to Orders
      </Link>
      <h2 className="text-center text-3xl font-bold mb-6">Order #{order.id}</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8 text-center md:text-left">
        <div><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</div>
        <div><strong>Total:</strong> ₱{parseFloat(order.total || 0).toFixed(2)}</div>
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-semibold capitalize ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <h3 className="mt-8 mb-4 pb-2 border-b-2 border-gray-200 text-xl font-semibold">Items</h3>
      <div className="flex flex-col gap-2">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <img src={`${PRODUCT_ASSET_URL}/${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
              <span>{item.name} (x{item.quantity})</span>
            </div>
            <span className="font-medium">₱{parseFloat(item.price || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link to={`/track-order/${order.id}`} className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg font-semibold transition hover:bg-blue-700">
          Track Order
        </Link>
        {order.status === 'pending' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold transition hover:bg-red-700">
            Cancel Order
          </button>
        )}
      </div>
      <CancelOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default MyOrders;
