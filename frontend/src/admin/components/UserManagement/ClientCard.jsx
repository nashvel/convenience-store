import React from 'react';
import { FiMail, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';

const ClientCard = ({ client }) => {
    const logoUrl = client.store_logo 
        ? `http://localhost:8080/uploads/logos/${client.store_logo}` 
        : '/images/placeholder.svg';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <img src={logoUrl} alt={`${client.store_name} logo`} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{client.store_name || 'N/A'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.first_name} {client.last_name}</p>
                    </div>
                    <div className="relative">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <FiMoreVertical size={20} />
                        </button>
                        {/* Dropdown menu can be added here */}
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FiMail className="mr-2" />
                        <span>{client.email}</span>
                    </div>

                    <div className="flex items-center">
                        {client.is_verified == 1 ? (
                            <span className="flex items-center text-green-500">
                                <FiCheckCircle className="mr-2" />
                                Verified
                            </span>
                        ) : (
                            <span className="flex items-center text-red-500">
                                <FiXCircle className="mr-2" />
                                Not Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined: {new Date(client.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
};

export default ClientCard;
