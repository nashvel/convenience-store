import React, { useState } from 'react';
import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import MapModal from './MapModal';
import ConfirmationModal from './ConfirmationModal';

const OrderCard = ({ order, onAccept }) => {
  const [isMapVisible, setMapVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const earnings = (order.total * 0.15).toFixed(2); // Example: 15% earnings

  const handleViewOnMap = () => setMapVisible(true);
  const handleCloseMap = () => setMapVisible(false);

  const handleAcceptClick = () => setConfirmVisible(true);
  const handleCancelAccept = () => setConfirmVisible(false);

  const handleConfirmAccept = () => {
    onAccept(order.id);
    setConfirmVisible(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-800 text-md">{order.storeName}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-600 mb-4">
          <div className="flex items-start space-x-2">
            <FaStore className="text-gray-400 mt-0.5" />
            <span>{order.storeAddress}</span>
          </div>
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
            <span>{order.deliveryAddress}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <p className="text-sm font-bold text-blue-600">Est. Earnings: ₱{earnings}</p>
          <div className="flex items-center space-x-2">
            <button onClick={handleViewOnMap} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-md transition-colors duration-200">
              View on Map
            </button>
            <button 
              onClick={handleAcceptClick} 
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200"
            >
              Accept Order
            </button>
          </div>
        </div>
      </div>

      {isMapVisible && <MapModal order={order} onClose={handleCloseMap} />}

      {isConfirmVisible && (
        <ConfirmationModal
          title="Accept Order"
          message={`Are you sure you want to accept this order from ${order.storeName}?`}
          onConfirm={handleConfirmAccept}
          onCancel={handleCancelAccept}
          confirmText="Accept"
        />
      )}
    </>
  );
};

export default OrderCard;

