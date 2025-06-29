import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiSearch, FiPlus, FiLoader, FiAlertTriangle, FiCheckCircle, FiXCircle, FiMoreVertical, FiUserX } from 'react-icons/fi';

const Riders = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    const navigate = useNavigate();

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

    // Function to fetch riders
    const fetchRiders = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await fetch('/api/admin/riders', {
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

    // Effect to fetch riders on component mount or when user changes
    useEffect(() => {
        fetchRiders();
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
            const response = await fetch(`/api/admin/riders/${userId}/blacklist`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchRiders(); // Refresh the list
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
            const response = await fetch(`/api/admin/riders/${editingUser.id}`, {
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

            await fetchRiders();
            setEditingUser(null);
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
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading Riders...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 rounded-lg p-6">
                    <FiAlertTriangle className="text-4xl text-red-500" />
                    <p className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">Failed to load riders</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            );
        }

        if (filteredUsers.length === 0) {
            return (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 dark:text-gray-400">No riders found.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            <th className="px-6 py-3">Rider</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${user.is_blacklisted ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-full mr-4"/>
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
                                    {user.is_blacklisted == 1 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                                            <FiUserX className="mr-1.5" />
                                            Blacklisted
                                        </span>
                                    ) : user.is_verified == 1 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                            <FiCheckCircle className="mr-1.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                                            <FiXCircle className="mr-1.5" />
                                            Not Verified
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
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
        <>
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Rider</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="grid grid-cols-1 gap-6">
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
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rider Management</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and monitor all rider accounts.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/add-rider')}
                        className="mt-4 sm:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                        <FiPlus className="mr-2" />
                        Add New Rider
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
        </>
    );
};

export default Riders;
