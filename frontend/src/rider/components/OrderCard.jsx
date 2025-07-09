import React, { useState } from 'react';
import { FaStore, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';
import MapModal from './MapModal';
import api from '../../api/axios-config';
import { toast } from 'react-toastify';

const OrderCard = ({ order, onUpdate }) => {
  const [isMapVisible, setMapVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const earnings = (order.total * 0.15).toFixed(2); // Example: 15% earnings

  const handleViewOnMap = () => setMapVisible(true);
  const handleCloseMap = () => setMapVisible(false);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await api.put(`/orders/status/${order.id}`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Order marked as ${newStatus.replace('_', ' ')}!`);
        if (onUpdate) {
          onUpdate(); // Refresh the list of orders
        }
      } else {
        toast.error(response.data.message || 'Failed to update order status.');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('An error occurred while updating the order.');
    } finally {
      setIsUpdating(false);
    }
  };

  const deliveryAddress = `${order.line1}, ${order.city}, ${order.province}`;
  const storeAddress = `${order.store_line1}, ${order.store_city}, ${order.store_province}`;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{order.store_name}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
            order.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
            order.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        {/* Store and Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {/* Store Info */}
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Pickup From</h4>
            <div className="flex items-start space-x-2 mb-1">
              <FaStore className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span>{storeAddress}</span>
            </div>
          </div>
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Deliver To</h4>
            <div className="flex items-start space-x-2 mb-1">
              <FaUser className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span>{order.delivery_full_name}</span>
            </div>
            <div className="flex items-start space-x-2 mb-1">
              <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span>{deliveryAddress}</span>
            </div>
            <div className="flex items-start space-x-2">
              <FaPhone className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span>{order.delivery_phone}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center mt-auto">
          <p className="text-sm font-bold text-primary">Est. Earnings: ₱{earnings}</p>
          <div className="flex items-center space-x-2">
            <button onClick={handleViewOnMap} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-3 rounded-md transition-colors duration-200">
              View Map
            </button>
            {order.status === 'accepted' && (
              <button 
                onClick={() => handleUpdateStatus('in_transit')} 
                disabled={isUpdating}
                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isUpdating ? 'Starting...' : 'Start Delivery'}
              </button>
            )}
            {order.status === 'in_transit' && (
              <button 
                onClick={() => handleUpdateStatus('delivered')} 
                disabled={isUpdating}
                className="text-xs bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isUpdating ? 'Completing...' : 'Mark as Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isMapVisible && <MapModal order={order} onClose={handleCloseMap} />}
    </>
  );
};

export default OrderCard;

