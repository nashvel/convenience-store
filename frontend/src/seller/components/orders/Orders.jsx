import React, { useState, useEffect } from 'react';
import api from '../../../api/axios-config';
import { toast } from 'react-toastify';
import { FaSpinner, FaMapMarkerAlt, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AssignRiderModal from '../modals/AssignRiderModal';
import { useAuth } from '../../../context/AuthContext';
import { PRODUCT_ASSET_URL } from '../../../config';

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

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="mt-6 flex justify-center">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight border border-gray-300 ${
                                currentPage === number
                                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const Orders = () => {
    const [activeTab, setActiveTab] = useState('incoming');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const itemsPerPage = 20;
    const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedRider, setSelectedRider] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [riders, setRiders] = useState([]);

    useEffect(() => {
        const fetchRiders = async () => {
            if (!user || !user.store_id) return;
            try {
                const response = await api.get(`/stores/${user.store_id}/riders`);
                if (response.data.success) {
                    setRiders(response.data.riders);
                } else {
                    console.error('Failed to fetch riders:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching riders:', error);
            }
        };

        const fetchOrders = async () => {
            if (!user || !user.store_id) {
                setError('Store not found. Please ensure you are logged in as a seller.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/orders?store_id=${user.store_id}`);
                if (response.data.success) {
                    const sortedOrders = response.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setOrders(sortedOrders);
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
        fetchRiders();
    }, [user]);

    const updateOrderStatus = async (orderId, status, riderId = null) => {
        setUpdatingOrderId(orderId);
        try {
            const payload = { status };
            if (riderId) {
                payload.rider_id = riderId;
            }
            const response = await api.put(`/orders/status/${orderId}`, payload);
            if (response.data.success) {
                toast.success(`Order #${orderId} has been ${status}.`);
                // Refetch orders to get the latest data including rider info
                const fetchOrders = async () => {
                    try {
                        const response = await api.get(`/orders?store_id=${user.store_id}`);
                        if (response.data.success) {
                            const sortedOrders = response.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                            setOrders(sortedOrders);
                        } else {
                            toast.error(response.data.message || 'Failed to refresh orders.');
                        }
                    } catch (err) {
                        toast.error('An error occurred while refreshing orders.');
                    }
                };
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Failed to update order status.');
            }
        } catch (err) {
            console.error('Update order status error:', err);
            toast.error(err.response?.data?.message || 'An error occurred while updating the order.');
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleOpenRiderModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsRiderModalOpen(true);
        if (riders.length > 0) {
            setSelectedRider(riders[0].id);
        }
    };

    const handleConfirmRiderAssignment = async () => {
        if (!selectedRider) {
            toast.error('Please select a rider.');
            return;
        }
        await updateOrderStatus(selectedOrderId, 'accepted', selectedRider);
        setIsRiderModalOpen(false);
        setSelectedOrderId(null);
        setSelectedRider('');
    };
    const handleDecline = (orderId) => updateOrderStatus(orderId, 'rejected');
    const handleToggleDetails = (orderId) => setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const incomingOrders = orders.filter(order => order.status === 'pending');
    const transactionOrders = orders.filter(order => order.status !== 'pending' && order.status !== 'rejected');

    const activeOrders = activeTab === 'incoming' ? incomingOrders : transactionOrders;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activeOrders.slice(indexOfFirstItem, indexOfLastItem);
    
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(activeOrders.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

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



    const StatusBadge = ({ status }) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            in_transit: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            rejected: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
            <div className="border-b border-gray-200">
                <div className="flex -mb-px">
                    <TabButton label="Incoming Orders" count={incomingOrders.length} isActive={activeTab === 'incoming'} onClick={() => handleTabChange('incoming')} />
                    <TabButton label="Transactions" count={transactionOrders.length} isActive={activeTab === 'transactions'} onClick={() => handleTabChange('transactions')} />
                </div>
            </div>

            <div className="mt-8">
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((order) => {
                                    const customerName = `${order.first_name} ${order.last_name}`;
                                    const isExpanded = expandedOrderId === order.id;
                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{Number(order.total_amount).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {order.status === 'pending' ? (
                                                        <div className="flex items-center gap-3">
                                                            {updatingOrderId === order.id ? (
                                                                <div className="flex items-center gap-2 text-gray-500 px-2">
                                                                    <FaSpinner className="animate-spin" />
                                                                    <span>Updating...</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleOpenRiderModal(order.id)} className="flex items-center gap-1 text-green-600 hover:text-green-900"><FaCheck /> Accept</button>
                                                                    <button onClick={() => handleDecline(order.id)} className="flex items-center gap-1 text-red-600 hover:text-red-900"><FaTimes /> Decline</button>
                                                                </>
                                                            )}
                                                            <button onClick={() => handleToggleDetails(order.id)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 ml-2" disabled={updatingOrderId === order.id}>
                                                                {isExpanded ? <><FaChevronUp /> Hide</> : <><FaChevronDown /> Details</>}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleToggleDetails(order.id)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900">
                                                            {isExpanded ? <><FaChevronUp /> Hide Details</> : <><FaChevronDown /> View Details</>}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="6" className="p-4 bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Order Items Section */}
                                                            <div className="p-4 bg-white rounded-lg shadow-inner">
                                                                <h4 className="text-md font-semibold mb-3 text-gray-700">Order Items</h4>
                                                                <div className="flex flex-col gap-4">
                                                                    {order.items.map((item, index) => (
                                                                        <div key={index} className="flex gap-4 items-center">
                                                                            <img src={`${PRODUCT_ASSET_URL}/${item.product_image}`} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                                                            <div className="flex-grow">
                                                                                <p className="font-bold text-gray-800">{item.product_name}</p>
                                                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                                                <p className="text-sm text-gray-500">Price: ₱{Number(item.price).toFixed(2)}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Delivery Details Section */}
                                                            <div className="p-4 bg-white rounded-lg shadow-inner">
                                                                <h4 className="text-md font-semibold mb-3 text-gray-700">Delivery Details</h4>
                                                                <div className="text-sm text-gray-600">
                                                                    <p className="font-bold">{order.delivery_full_name}</p>
                                                                    <p>{order.delivery_phone}</p>
                                                                    <p>{order.line1}, {order.line2 ? `${order.line2}, ` : ''}</p>
                                                                    <p>{order.city}, {order.province} {order.zip_code}</p>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <button 
                                                                        onClick={() => {
                                                                            if (order.latitude && order.longitude) {
                                                                                window.open(`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`, '_blank');
                                                                            } else {
                                                                                const address = `${order.line1}, ${order.line2 || ''}, ${order.city}, ${order.province}, ${order.zip_code}`;
                                                                                const query = encodeURIComponent(address);
                                                                                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                                                                toast.info('Coordinates not available, searching by address instead.');
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                                    >
                                                                        <FaMapMarkerAlt className="mr-2 -ml-1 h-5 w-5" />
                                                                        Get Directions
                                                                    </button>
                                                                </div>
                                                                {/* Assigned Rider Section */}
                                                                {order.rider_first_name && (
                                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                                        <h5 className="text-sm font-semibold text-gray-700">Assigned Rider</h5>
                                                                        <p className="text-sm text-gray-600">{`${order.rider_first_name} ${order.rider_last_name}`}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No {activeTab === 'incoming' ? 'incoming orders' : 'transactions'} found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={activeOrders.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>

            <AssignRiderModal
                isOpen={isRiderModalOpen}
                onClose={() => setIsRiderModalOpen(false)}
                onConfirm={handleConfirmRiderAssignment}
                riders={riders}
                selectedRider={selectedRider}
                onRiderChange={(e) => setSelectedRider(e.target.value)}
            />
        </div>
    );
};

export default Orders;