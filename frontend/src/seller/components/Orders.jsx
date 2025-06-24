import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaMotorcycle, FaCheck, FaTimes, FaTags, FaRulerCombined, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PRODUCT_ASSET_URL } from '../../config';

const TabButton = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>{count}</span>
  </button>
);

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
    <div className="w-5 text-center text-gray-400">{icon}</div>
    <span>{text}</span>
  </div>
);

const OrderCard = ({ order, onAccept, onDecline, isTransaction = false }) => {
    const customerName = `${order.first_name} ${order.last_name}`;
    const deliveryAddress = JSON.parse(order.delivery_address);
    const fullAddress = `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.zipCode}`;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-5 transition-shadow duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 text-lg">#{order.id}</h3>
                <p className="text-gray-600 font-semibold">{customerName}</p>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-b border-gray-100 py-4 max-h-48 overflow-y-auto">
                {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <img src={`${PRODUCT_ASSET_URL}/${item.product_image}`} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        <div className="flex-grow">
                            <p className="font-bold text-gray-800">{item.product_name}</p>
                            <InfoItem icon={<FaBoxOpen />} text={`Quantity: ${item.quantity}`} />
                            <InfoItem icon={<FaTags />} text={`Price: ₱${Number(item.price).toFixed(2)}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                <InfoItem icon={<FaCreditCard />} text={`Total: ₱${Number(order.total_amount).toFixed(2)}`} />
                <InfoItem icon={<FaMapMarkerAlt />} text={fullAddress} />
                {!isTransaction && (
                    <div className="flex items-center gap-3">
                        <div className="w-5 text-center text-gray-400"><FaMotorcycle /></div>
                        <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-light outline-none">
                            <option value="">Assign Rider</option>
                            {/* Rider assignment logic to be implemented */}
                        </select>
                    </div>
                )}
            </div>

            {!isTransaction && (
                <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100">
                    <button onClick={() => onAccept(order.id)} className="w-full py-2.5 px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><FaCheck /> Accept</button>
                    <button onClick={() => onDecline(order.id)} className="w-full py-2.5 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><FaTimes /> Decline</button>
                </div>
            )}
        </div>
    );
};

const Orders = () => {
    const [activeTab, setActiveTab] = useState('incoming');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.store_id) {
                setError('Store not found. Please ensure you are logged in as a seller.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/orders?store_id=${user.store_id}`);
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    setError(response.data.message || 'Failed to fetch orders.');
                    toast.error(response.data.message || 'Failed to fetch orders.');
                }
            } catch (err) {
                console.error('Fetch orders error:', err);
                const errorMessage = err.response?.data?.message || 'An error occurred while fetching orders.';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/orders/status/${orderId}`, { status });
            if (response.data.success) {
                toast.success(`Order #${orderId} has been ${status}.`);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, status: status } : order
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to update order status.');
            }
        } catch (err) {
            console.error('Update order status error:', err);
            toast.error(err.response?.data?.message || 'An error occurred while updating the order.');
        }
    };

    const handleAccept = (orderId) => updateOrderStatus(orderId, 'accepted');
    const handleDecline = (orderId) => updateOrderStatus(orderId, 'rejected');

    const incomingOrders = orders.filter(order => order.status === 'pending');
    const transactionOrders = orders.filter(order => order.status !== 'pending' && order.status !== 'rejected');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
            <div className="border-b border-gray-200">
                <div className="flex -mb-px">
                    <TabButton label="Incoming Orders" count={incomingOrders.length} isActive={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')} />
                    <TabButton label="Transactions" count={transactionOrders.length} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                </div>
            </div>

            <div className="mt-8">
                {activeTab === 'incoming' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {incomingOrders.length > 0 ? (
                            incomingOrders.map((order) => (
                                <OrderCard key={order.id} order={order} onAccept={handleAccept} onDecline={handleDecline} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No incoming orders.</p>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div>
                        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-6 flex items-center gap-3">
                            <FaInfoCircle className="text-xl" />
                            <p className="font-semibold">This section shows all processed orders.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {transactionOrders.length > 0 ? (
                                transactionOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} isTransaction={true} />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;