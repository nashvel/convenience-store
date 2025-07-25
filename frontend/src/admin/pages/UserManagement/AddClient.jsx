import React from 'react';
import { Toaster } from 'react-hot-toast';
import UserManagementQuickLinks from '../../components/UserManagement/QuickLinks';
import ClientForm from "../../components/UserManagement/ClientForm";

export default function AddClient() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <UserManagementQuickLinks />
      <div className="pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Client</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Create a new client account and add them to the system.</p>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <ClientForm />
        </div>
      </div>
    </div>
  );
}
