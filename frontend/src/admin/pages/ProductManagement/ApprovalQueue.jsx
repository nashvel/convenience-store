import React, { useState } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { CheckIcon, XIcon } from '@heroicons/react/solid';

const mockApprovalItems = [
  {
    id: 6,
    name: 'Organic Whole Bean Coffee',
    image: 'https://via.placeholder.com/300',
    category: 'Groceries',
    price: 18.50,
    description: 'A medium roast coffee with notes of chocolate and citrus. Sourced from sustainable farms in Colombia.',
    owner: 'The Coffee Bean Co.',
    submittedDate: '2023-10-26',
  },
  {
    id: 7,
    name: 'Handmade Leather Wallet',
    image: 'https://via.placeholder.com/300',
    category: 'Accessories',
    price: 75.00,
    description: 'A minimalist wallet crafted from full-grain leather. Features 4 card slots and a cash compartment.',
    owner: 'Artisan Goods',
    submittedDate: '2023-10-25',
  },
  {
    id: 8,
    name: 'Smart Fitness Tracker',
    image: 'https://via.placeholder.com/300',
    category: 'Electronics',
    price: 129.99,
    description: 'Track your steps, heart rate, and sleep patterns with this sleek and waterproof fitness tracker.',
    owner: 'GadgetStore',
    submittedDate: '2023-10-24',
  },
];

const ApprovalQueue = () => {
  const [items, setItems] = useState(mockApprovalItems);

  const handleApprove = (id) => {
    setItems(items.filter(item => item.id !== id));
    // Here you would typically call an API to approve the item
  };

  const handleReject = (id) => {
    setItems(items.filter(item => item.id !== id));
    // Here you would typically call an API to reject the item
  };

  return (
    <>
      <PageMeta
        title="Approval Queue | Admin Dashboard"
        description="Review and approve new products"
      />
      <PageBreadcrumb pageTitle="Approval Queue" />

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Product Approval Queue</h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{items.length} items pending</span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <img className="w-full h-48 object-cover" src={item.image} alt={item.name} />
                <div className="p-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.category} &bull; Submitted by {item.owner}</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">${item.price.toFixed(2)}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 h-20 overflow-y-auto">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Submitted on: {item.submittedDate}</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white">The approval queue is empty.</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Great job! All products have been reviewed.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ApprovalQueue;
