import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiSearch, FiPlus, FiLoader, FiAlertTriangle, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await fetch('/api/admin/customers', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [user]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        return users.filter(u =>
            (u.first_name && u.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.last_name && u.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <FiLoader className="animate-spin text-4xl text-blue-500" />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading Customers...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 rounded-lg p-6">
                    <FiAlertTriangle className="text-4xl text-red-500" />
                    <p className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">Failed to load customers</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            );
        }

        if (filteredUsers.length === 0) {
            return (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 dark:text-gray-400">No customers found.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`} alt="" className="w-10 h-10 rounded-full mr-4"/>
                                        <div>
                                            <div className="font-semibold text-sm">{user.first_name} {user.last_name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm">{user.email}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.phone || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.is_verified == 1 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                            <FiCheckCircle className="mr-1.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                                            <FiXCircle className="mr-1.5" />
                                            Not Verified
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                        <FiMoreVertical size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and monitor all customer accounts.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/add-customer')}
                    className="mt-4 sm:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                    <FiPlus className="mr-2" />
                    Add New Customer
                </button>
            </div>

            <div className="mb-8">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                {renderContent()}
            </div>
        </div>
    );
};

export default Customers;
