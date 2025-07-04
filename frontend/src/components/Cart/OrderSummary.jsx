import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const OrderSummary = ({ subtotal, shippingFee, total, onCheckout, selectedItemCount }) => {
  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
      <div className="space-y-4 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal ({selectedItemCount} items)</span>
          <span className="font-medium text-gray-900">₱{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-1.5">
            Shipping Fee
            <span className="group relative">
              <FaInfoCircle className="text-gray-400 cursor-pointer" />
              <span className="absolute bottom-full mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Shipping fee is calculated based on the selected items' stores.
              </span>
            </span>
          </span>
          <span className="font-medium text-gray-900">₱{formatPrice(shippingFee)}</span>
        </div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex justify-between font-bold text-2xl">
          <span>Total</span>
          <span className="text-primary">₱{formatPrice(total)}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        disabled={selectedItemCount === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
