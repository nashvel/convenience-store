import React from 'react';
import { FaList, FaMapMarkerAlt } from 'react-icons/fa';

const AddressMethodSelector = ({ addressSelectionMethod, handleAddressMethodSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to set your address?</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleAddressMethodSelect('select')}
          className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 h-20 ${
            addressSelectionMethod === 'select'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          <FaList className="text-xl" />
          <span className="font-medium mt-1 text-sm">Select Address</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddressMethodSelect('map')}
          className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 h-20 ${
            addressSelectionMethod === 'map'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          <FaMapMarkerAlt className="text-xl" />
          <span className="font-medium mt-1 text-sm">Point on Map</span>
        </button>
      </div>
    </div>
  );
};

export default AddressMethodSelector;
