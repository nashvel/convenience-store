import React from 'react';

const AssignRiderModal = ({ isOpen, onClose, onConfirm, riders, selectedRider, onRiderChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Rider</h2>
        <p className="mb-4 text-gray-600">Please select a rider to assign to this order before accepting.</p>
        
        <div className="mb-6">
          <label htmlFor="rider-select" className="block text-sm font-medium text-gray-700 mb-1">
            Available Riders
          </label>
          <select
            id="rider-select"
            value={selectedRider}
            onChange={onRiderChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="" disabled>Select a rider...</option>
            {riders.map(rider => (
              <option key={rider.id} value={rider.id}>
                {rider.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedRider}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRiderModal;
