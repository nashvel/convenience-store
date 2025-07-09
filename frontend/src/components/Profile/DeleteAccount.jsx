import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = () => {
    // TODO: Replace with actual API call
    console.log('Deleting account...');
    toast.success('Account deleted successfully.');
    // Should also log the user out and redirect
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-600 mb-1">Delete Account</h2>
      <p className="mb-6 text-gray-500">Permanently remove your account and all of its content. This action is not reversible.</p>
      
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm text-red-700">Once you delete your account, you will lose all data associated with it.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-red-600 hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900">Are you absolutely sure?</h3>
            <p className="mt-2 text-gray-600">This action cannot be undone. To confirm, please type <strong>DELETE</strong> below.</p>
            
            <input 
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full mt-4 p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="DELETE"
            />

            <div className="mt-6 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={confirmationText !== 'DELETE'}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
