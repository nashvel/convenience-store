import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ClientCard from '../../components/UserManagement/ClientCard';
import { FiSearch, FiPlus, FiLoader, FiAlertTriangle } from 'react-icons/fi';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await fetch('/api/admin/clients', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setClients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [user]);

    const filteredClients = useMemo(() => {
        if (!searchTerm) {
            return clients;
        }
        return clients.filter(client =>
            (client.store_name && client.store_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (client.first_name && client.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (client.last_name && client.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [clients, searchTerm]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <FiLoader className="animate-spin text-4xl text-blue-500" />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading Clients...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 rounded-lg p-6">
                    <FiAlertTriangle className="text-4xl text-red-500" />
                    <p className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">Failed to load clients</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            );
        }

        if (filteredClients.length === 0) {
            return (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 dark:text-gray-400">No clients found.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClients.map(client => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Management</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and monitor all client accounts.</p>
                </div>
                                <button 
                    onClick={() => navigate('/admin/add-client')}
                    className="mt-4 sm:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">

                    <FiPlus className="mr-2" />
                    Add New Client
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by store, name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 shadow-sm"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                {renderContent()}
            </div>
        </div>
    );
};

export default Clients;
