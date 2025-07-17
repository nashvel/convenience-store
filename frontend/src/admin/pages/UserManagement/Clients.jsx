import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios-config';
import ClientCard from '../../components/UserManagement/ClientCard';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { FiSearch, FiPlus, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import UserManagementQuickLinks from '../../components/UserManagement/QuickLinks';
import toast from 'react-hot-toast';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await api.get('/admin/clients');
                setClients(response.data);
            } catch (err) {
                setError(err.message);
                toast.error('Failed to fetch clients.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [user]);

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;

        const toastId = toast.loading('Deleting client...');
        try {
            await api.delete(`/admin/clients/${clientToDelete.id}`);
            setClients(clients.filter(c => c.id !== clientToDelete.id));
            toast.success('Client deleted successfully.', { id: toastId });
        } catch (err) {
            toast.error('Failed to delete client.', { id: toastId });
        } finally {
            setIsModalOpen(false);
            setClientToDelete(null);
        }
    };

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
                    <ClientCard key={client.id} client={client} onDelete={handleDeleteClick} />
                ))}
            </div>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <UserManagementQuickLinks />
            <div className="pt-4 sm:pt-6 lg:pt-8">
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

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Client Account"
                message="This will permanently delete the client, their store, and all associated data. This action cannot be undone."
                item={clientToDelete ? `${clientToDelete.first_name} ${clientToDelete.last_name} (${clientToDelete.email})` : ''}
                confirmationTextToMatch={clientToDelete ? `${clientToDelete.first_name} ${clientToDelete.last_name}`.trim() : ''}
            />
        </div>
    );
};

export default Clients;
