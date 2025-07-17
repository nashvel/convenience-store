import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiSearch, FiPlus, FiLoader, FiAlertTriangle, FiCheckCircle, FiXCircle, FiMoreVertical, FiUserX } from 'react-icons/fi';
import UserManagementQuickLinks from '../../components/UserManagement/QuickLinks';

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const getInitials = (firstName, lastName) => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        if (firstName) {
            return firstName.substring(0, 2).toUpperCase();
        }
        return '?';
    };

    // Effect to handle clicks outside the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to fetch customers
    const fetchCustomers = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await fetch('/api/admin/customers', {
                headers: { 'Authorization': `Bearer ${user.token}` }
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

    // Effect to fetch customers on component mount or when user changes
    useEffect(() => {
        fetchCustomers();
    }, [user]);

    // Memoized filtered users
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

    // Handler to open the edit modal
    const handleEdit = (user) => {
        setEditingUser({ ...user }); // Create a copy to avoid mutating state directly
        setActiveDropdown(null);
    };

    // Handler to toggle blacklist status
    const handleBlacklist = async (userId) => {
        try {
            const response = await fetch(`/api/admin/customers/${userId}/blacklist`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchCustomers(); // Refresh the list
            setActiveDropdown(null);
        } catch (err) {
            console.error('Failed to blacklist user:', err);
            // Optionally, show an error message to the user
        }
    };

    // Handler to submit the user update form
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const response = await fetch(`/api/admin/customers/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(editingUser)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchCustomers();
            setEditingUser(null); // Close the modal on success
        } catch (err) {
            console.error('Failed to update user:', err);
            // Optionally, show an error message to the user
        }
    };

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
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Joined</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.avatar ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{getInitials(user.first_name, user.last_name)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.is_blacklisted ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                            <FiUserX className="mr-1.5" />
                                            Blacklisted
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                            <FiCheckCircle className="mr-1.5" />
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center relative">
                                    <button 
                                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50"
                                        disabled={user.is_blacklisted && activeDropdown !== user.id}
                                    >
                                        <FiMoreVertical size={20} />
                                    </button>
                                    {activeDropdown === user.id && (
                                        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(user); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleBlacklist(user.id); }} className={`block px-4 py-2 text-sm ${user.is_blacklisted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                                                    {user.is_blacklisted ? 'Un-blacklist' : 'Blacklist'}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100 opacity-100">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Customer</h2>
                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input type="text" placeholder="First Name" value={editingUser.first_name || ''} onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input type="text" placeholder="Last Name" value={editingUser.last_name || ''} onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input type="email" placeholder="Email" value={editingUser.email || ''} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input type="text" placeholder="Phone" value={editingUser.phone || ''} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="mt-8 flex justify-end space-x-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <UserManagementQuickLinks />
            <div className="pt-4 sm:pt-6 lg:pt-8">
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
        </div>
    );
};

export default Customers;
