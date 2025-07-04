import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import OrderListSkeleton from '../../components/Skeletons/OrderListSkeleton';
import OrderCard from '../../components/OrderCard';
import { FaShoppingBag } from 'react-icons/fa';

const MyOrdersList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders?userId=${user.id}`);
        if (response.data.success) {
          const sortedOrders = response.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setOrders(sortedOrders);
        } else {
          setError('Failed to fetch orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const filterTabs = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Shipped') return order.status === 'shipped' || order.status === 'accepted';
    return order.status.toLowerCase() === activeFilter.toLowerCase();
  });

  if (loading) return <OrderListSkeleton />;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-extrabold mb-8 text-gray-800">My Orders</h1>

      <div className="mb-8 flex justify-center border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`${activeFilter === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md">
          <FaShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">No orders found</h3>
          <p className="mt-2 text-gray-500">
            You don't have any {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders yet.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrdersList;
