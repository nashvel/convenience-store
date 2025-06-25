import React from 'react';
import { FaTimes, FaMoneyBillWave, FaWallet } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, selectedOption, onSelect }) => {
  if (!isOpen) return null;

  const handleSelect = (option) => {
    onSelect(option);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Select Payment Method</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOption === 'cod' ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-primary'}`}
            onClick={() => handleSelect('cod')}
          >
            <div className="flex items-center">
              <FaMoneyBillWave className="mr-3 text-primary" size={24} />
              <div>
                <h3 className="font-semibold text-lg">Cash on Delivery</h3>
                <p className="text-sm text-gray-600">Pay with cash upon delivery of your order.</p>
              </div>
            </div>
          </div>
          <div 
            className={`p-4 border rounded-lg cursor-not-allowed transition-all border-gray-200 bg-gray-100`}
          >
            <div className="flex items-center">
              <FaWallet className="mr-3 text-gray-400" size={24} />
              <div>
                <h3 className="font-semibold text-lg text-gray-400">GCash (Coming Soon)</h3>
                <p className="text-sm text-gray-500">Online payment with GCash will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
