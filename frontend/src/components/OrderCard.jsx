import React from 'react';
import { Link } from 'react-router-dom';
import { FaReceipt, FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const statusInfo = {
  pending: {
    icon: <FaBoxOpen className="text-yellow-500" />,
    text: 'Pending',
    bg: 'bg-yellow-100',
    text_color: 'text-yellow-800',
  },
  accepted: {
    icon: <FaCheckCircle className="text-blue-500" />,
    text: 'Processing',
    bg: 'bg-blue-100',
    text_color: 'text-blue-800',
  },
  shipped: {
    icon: <FaShippingFast className="text-green-500" />,
    text: 'Shipped',
    bg: 'bg-green-100',
    text_color: 'text-green-800',
  },
  delivered: {
    icon: <FaCheckCircle className="text-indigo-500" />,
    text: 'Delivered',
    bg: 'bg-indigo-100',
    text_color: 'text-indigo-800',
  },
  cancelled: {
    icon: <FaTimesCircle className="text-red-500" />,
    text: 'Cancelled',
    bg: 'bg-red-100',
    text_color: 'text-red-800',
  },
  rejected: {
    icon: <FaTimesCircle className="text-red-500" />,
    text: 'Rejected',
    bg: 'bg-red-100',
    text_color: 'text-red-800',
  },
  default: {
    icon: <FaReceipt className="text-gray-500" />,
    text: 'Status Unknown',
    bg: 'bg-gray-100',
    text_color: 'text-gray-800',
  },
};

const OrderCard = ({ order }) => {
  const currentStatus = statusInfo[order.status] || statusInfo.default;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Order #{order.id}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${currentStatus.bg} ${currentStatus.text_color}`}>
            {React.cloneElement(currentStatus.icon, { className: 'w-4 h-4' })}
            <span>{currentStatus.text}</span>
          </div>
        </div>
        
        <div className="my-6">
          {/* In a future update, we can show product images here if the API provides them. */}
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-gray-800">
            ₱{parseFloat(order.total_amount || 0).toFixed(2)}
          </p>
        </div>

        <Link 
          to={`/my-orders/${order.id}`} 
          className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
