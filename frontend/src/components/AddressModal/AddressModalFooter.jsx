import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const AddressModalFooter = ({ onClose, handleSave, isSaving }) => {
  return (
    <div className="mt-8 flex gap-3">
      <button 
        type="button" 
        onClick={onClose} 
        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Saving...
          </>
        ) : (
          'Save Address'
        )}
      </button>
    </div>
  );
};

export default AddressModalFooter;
