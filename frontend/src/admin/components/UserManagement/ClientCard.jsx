import React, { useState, useRef, useEffect } from 'react';
import { FiMail, FiCheckCircle, FiXCircle, FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ClientCard = ({ client, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        if (words.length > 1) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const logoUrl = client.store_logo 
        ? `http://localhost:8080/uploads/logos/${client.store_logo}` 
        : null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                    {logoUrl ? (
                        <img src={logoUrl} alt={`${client.store_name} logo`} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">{getInitials(client.store_name)}</span>
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{client.store_name || 'No Store Name Yet'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.first_name} {client.last_name}</p>
                    </div>
                                        <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            <FiMoreVertical size={20} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                                <Link 
                                    to={`/admin/clients/edit/${client.id}`}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <FiEdit className="mr-3" />
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => {
                                        onDelete(client);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <FiTrash2 className="mr-3" />
                                    Delete
                                </button>
                            </div>
                        )}
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
