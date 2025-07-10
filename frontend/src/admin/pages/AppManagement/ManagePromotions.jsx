import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPercent, FaTag, FaUpload, FaStore, FaGlobe, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaTimes, FaListUl, FaTrash } from 'react-icons/fa';
import api from '../../../api/axios-config';
import Spinner from '../../../components/Spinner/Spinner';

const ManagePromotions = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        scope_type: 'all_products',
        scope_value: '',
        is_active: true, // Default to active
    });
    const [promoImage, setPromoImage] = useState(null);
    const [stores, setStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingStores, setLoadingStores] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePromotions, setActivePromotions] = useState([]);
    const [loadingPromotions, setLoadingPromotions] = useState(false);



    const handleToggleChange = () => {
        setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setPromoImage(e.target.files[0]);
            if (successMessage) setSuccessMessage('');
            if (errorMessage) setErrorMessage('');
        }
    };

    const handleStoreChange = (storeId) => {
        setSelectedStores(prev =>
            prev.includes(storeId)
                ? prev.filter(id => id !== storeId)
                : [...prev, storeId]
        );
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    const fetchActivePromotions = async () => {
        setLoadingPromotions(true);
        try {
            const response = await api.get('/promotions/active');
            setActivePromotions(response.data.promotions || response.data || []);
        } catch (error) {
            toast.error('Could not load active promotions.');
            console.error('Failed to fetch active promotions', error);
        } finally {
            setLoadingPromotions(false);
        }
    };

    const handleOpenModal = () => {
        fetchActivePromotions();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (promoId) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                await api.delete(`/admin/promotions/${promoId}`);
                toast.success('Promotion deleted successfully!');
                fetchActivePromotions(); // Refresh the list
            } catch (error) {
                toast.error('Failed to delete promotion.');
                console.error('Delete promotion error:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('discount_type', formData.discount_type);
        submissionData.append('discount_value', formData.discount_value);
        submissionData.append('start_date', formData.start_date);
        submissionData.append('end_date', formData.end_date);
        submissionData.append('is_active', formData.is_active.toString());
        submissionData.append('scope_type', formData.scope_type);
        if (formData.scope_type !== 'all_products') {
            submissionData.append('scope_value', formData.scope_value);
        }

        if (promoImage) {
            submissionData.append('promo_image_banner', promoImage);
        }
        if (formData.scope === 'specific') {
            selectedStores.forEach(storeId => {
                submissionData.append('store_ids[]', storeId);
            });
        }

        try {
            await api.post('/admin/promotions', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMessage('Promotion created successfully!');
            setErrorMessage('');
            // Reset form
            setFormData({ title: '', description: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', scope: 'global' });
            setPromoImage(null);
            setSelectedStores([]);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to create promotion. Please check the details and try again.';
            setErrorMessage(errorMsg);
            setSuccessMessage('');
            console.error('Failed to create promotion', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
            <div className="w-full">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a New Promotion</h1>
                        <p className="text-lg text-gray-500">Fill out the details below to launch a new promotion for your customers.</p>
                    </div>
                    <button 
                        type="button"
                        onClick={handleOpenModal} 
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                    >
                        <FaListUl />
                        View Active Promotions
                    </button>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-md shadow-sm relative flex items-center gap-4">
                        <FaCheckCircle className="h-6 w-6" />
                        <p className="flex-grow">{successMessage}</p>
                        <button onClick={() => setSuccessMessage('')} className="text-green-800 hover:text-green-900">
                            <FaTimes />
                        </button>
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-md shadow-sm relative flex items-center gap-4">
                        <FaExclamationTriangle className="h-6 w-6" />
                        <p className="flex-grow">{errorMessage}</p>
                        <button onClick={() => setErrorMessage('')} className="text-red-800 hover:text-red-900">
                            <FaTimes />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 space-y-8">

                    {/* Promotion Details */}
                    <div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Promotion Title</label>
                                <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="e.g., Summer Sale" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="A brief summary of the promotion"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Discount and Duration */}
                    <div className="border-t border-gray-200 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                <select name="discount_type" id="discount_type" value={formData.discount_type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {formData.discount_type === 'percentage' ? <FaPercent className="text-gray-400" /> : <FaTag className="text-gray-400" />}
                                    </div>
                                    <input type="number" name="discount_value" id="discount_value" value={formData.discount_value} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="e.g., 15" required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required />
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="mt-6 flex items-center">
                            <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mr-4">Set as Active</label>
                            <div
                                role="switch"
                                aria-checked={formData.is_active}
                                onClick={handleToggleChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleToggleChange()}
                                tabIndex="0"
                                className={`${formData.is_active ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                <span className={`${formData.is_active ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                            </div>
                        </div>
                    </div>

                    {/* Banner and Scope */}
                    <div className="border-t border-gray-200 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Banner Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="promo_image_banner" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="promo_image_banner" name="promo_image_banner" type="file" className="sr-only" onChange={handleImageChange} required />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        {promoImage && <p className="text-sm text-green-600 mt-2">{promoImage.name}</p>}
                                    </div>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="scope_type" className="block text-sm font-medium text-gray-700 mb-1">Promotion Scope</label>
                                <select
                                    id="scope_type"
                                    name="scope_type"
                                    value={formData.scope_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                >
                                    <option value="all_products">All Products</option>
                                    <option value="store">Specific Store</option>
                                    <option value="category">Specific Category</option>
                                    <option value="product">Specific Product</option>
                                </select>
                                <p className="text-sm text-gray-500">Select the scope of the promotion.</p>
                            </div>
                            {formData.scope_type !== 'all_products' && (
                                <div>
                                    <label htmlFor="scope_value" className="block text-sm font-medium text-gray-700 mb-1">
                                        {formData.scope_type?.charAt(0).toUpperCase() + formData.scope_type?.slice(1)} ID
                                    </label>
                                    <input
                                        type="text"
                                        id="scope_value"
                                        name="scope_value"
                                        value={formData.scope_value}
                                        onChange={handleInputChange}
                                        placeholder={`Enter ${formData.scope_type} ID`}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                    <p className="text-sm text-gray-500">Provide the ID for the selected scope.</p>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-end border-t border-gray-200 pt-8">
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all duration-200">
                            {loading ? <Spinner color="text-white" /> : 'Create Promotion'}
                            {!loading && <FaArrowRight />}
                        </button>
                    </div>
                </form>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-xl font-bold text-gray-800">Active Promotions</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                {loadingPromotions ? (
                                    <div className="flex justify-center items-center h-48">
                                        <Spinner />
                                    </div>
                                ) : activePromotions.length > 0 ? (
                                    <ul className="space-y-4">
                                        {activePromotions.map(promo => (
                                             <li key={promo.id} className="border rounded-lg shadow-sm bg-gray-50 overflow-hidden">
                                                 {promo.image_url && (
                                                     <img src={promo.image_url} alt={promo.title} className="w-full h-40 object-cover" />
                                                 )}
                                                 <div className="p-4">
                                                     <div className="flex justify-between items-start">
                                                         <div>
                                                             <h4 className="text-lg font-bold text-gray-800">{promo.title}</h4>
                                                             <p className="text-sm text-gray-500">{promo.description}</p>
                                                         </div>
                                                         <div className="flex items-center gap-4">
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {promo.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100">
                                                                <FaTrash />
                                                            </button>
                                                         </div>
                                                     </div>
                                                     <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                         <p><span className="font-semibold">Discount:</span> {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' (fixed)'}</p>
                                                         <p><span className="font-semibold">Scope:</span> <span className="capitalize">{promo.scope_type} {promo.scope_value ? `(${promo.scope_value})` : ''}</span></p>
                                                         <p><span className="font-semibold">Starts:</span> {new Date(promo.start_date).toLocaleDateString()}</p>
                                                         <p><span className="font-semibold">Ends:</span> {new Date(promo.end_date).toLocaleDateString()}</p>
                                                     </div>
                                                 </div>
                                             </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No active promotions found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePromotions;
