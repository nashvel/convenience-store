import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AddressModalHeader = ({ addressLabel, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{addressLabel || 'Edit Address'}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModalHeader;
