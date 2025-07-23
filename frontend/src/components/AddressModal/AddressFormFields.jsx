import React from 'react';
import { FaHome, FaBriefcase } from 'react-icons/fa';

const AddressFormFields = ({ address, handleChange, selectedAddressData }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          name="full_name" 
          value={address.full_name || ''} 
          onChange={handleChange} 
          placeholder="Enter your full name" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          required 
        />
      </div>

      {selectedAddressData && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-800">Selected Address</p>
            <p className="text-sm text-gray-600">{selectedAddressData.fullAddress}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input type="tel" name="phone" value={address.phone || ''} onChange={handleChange} placeholder="e.g. 0917..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
        <div className="flex gap-3">
          <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${address.type === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="type" value="home" checked={address.type === 'home'} onChange={handleChange} className="sr-only" />
            <FaHome className={`mr-2 ${address.type === 'home' ? 'text-blue-600' : 'text-gray-500'}`} /> 
            <span className="font-medium">Home</span>
          </label>
          <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${address.type === 'office' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="type" value="office" checked={address.type === 'office'} onChange={handleChange} className="sr-only" />
            <FaBriefcase className={`mr-2 ${address.type === 'office' ? 'text-blue-600' : 'text-gray-500'}`} /> 
            <span className="font-medium">Office</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddressFormFields;
