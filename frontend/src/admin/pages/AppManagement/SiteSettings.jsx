import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaImage } from 'react-icons/fa';
import api from '../../../api/axios-config';
import Spinner from '../../../components/Spinner/Spinner';

const ImageUploadCard = ({ title, currentImageUrl, onFileSelect, newFilePreview }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Current Image</p>
                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                    {currentImageUrl ? (
                        <img src={currentImageUrl} alt={`Current ${title}`} className="h-full w-full object-contain" />
                    ) : (
                        <FaImage className="text-gray-400 text-4xl" />
                    )}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Upload New</p>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {newFilePreview ? (
                             <img src={newFilePreview} alt="New preview" className="mx-auto h-24 w-auto object-contain" />
                        ) : (
                            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor={title.toLowerCase().replace(' ', '-')}
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>{newFilePreview ? 'Change file' : 'Upload a file'}</span>
                                <input id={title.toLowerCase().replace(' ', '-')}
                                    name={title.toLowerCase().replace(' ', '-')}
                                    type="file" className="sr-only"
                                    onChange={onFileSelect} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SiteSettings = () => {
    const [settings, setSettings] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/api/site-settings');
                setSettings(response.data);
            } catch (error) {
                toast.error('Failed to fetch current site settings.');
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (fileType === 'logo') {
            setLogoFile(file);
            setLogoPreview(previewUrl);
        } else if (fileType === 'banner') {
            setBannerFile(file);
            setBannerPreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!logoFile && !bannerFile) {
            toast.info('No new images selected to upload.');
            return;
        }
        setLoading(true);

        const formData = new FormData();
        if (logoFile) formData.append('logo', logoFile);
        if (bannerFile) formData.append('restaurant_banner', bannerFile);

        try {
            const response = await api.post('/api/admin/site-settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(response.data.settings); // Update settings with new URLs from response
            setLogoFile(null);
            setBannerFile(null);
            setLogoPreview('');
            setBannerPreview('');
            toast.success('Site settings updated successfully!');
        } catch (error) {
            toast.error('Failed to update settings. Please try again.');
            console.error('Error updating settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Site Branding & Appearance</h1>
            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
                <ImageUploadCard 
                    title="Site Logo"
                    currentImageUrl={settings.logo_url}
                    onFileSelect={(e) => handleFileChange(e, 'logo')}
                    newFilePreview={logoPreview}
                />
                <ImageUploadCard 
                    title="Restaurant Banner"
                    currentImageUrl={settings.restaurant_banner_url}
                    onFileSelect={(e) => handleFileChange(e, 'banner')}
                    newFilePreview={bannerPreview}
                />
                <div className="flex justify-end pt-6">
                    <button type="submit" disabled={loading} className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                        {loading ? <Spinner /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettings;
