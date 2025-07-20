import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const OrderSummary = ({ subtotal, shippingFee, onCheckout, selectedItemCount }) => {
  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  const total = Number(subtotal) + Number(shippingFee);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sticky top-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <FaInfoCircle className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-700 font-medium">Subtotal</span>
              <p className="text-sm text-gray-500">{selectedItemCount} items selected</p>
            </div>
            <span className="font-bold text-xl text-gray-900">₱{formatPrice(subtotal)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="flex items-center gap-2 text-gray-700 font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Shipping Fee
            <span className="group relative">
              <FaInfoCircle className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
              <span className="absolute bottom-full mb-2 w-48 p-3 text-xs text-white bg-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg">
                Shipping fee is calculated based on the selected items' stores.
              </span>
            </span>
          </span>
          <span className="font-semibold text-gray-900">₱{formatPrice(shippingFee)}</span>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total Amount</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ₱{formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
        disabled={selectedItemCount === 0}
      >
        {selectedItemCount === 0 ? 'Select Items to Checkout' : `Proceed to Checkout (${selectedItemCount} items)`}
      </button>
      
      {selectedItemCount === 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Select items from your cart to proceed with checkout
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
