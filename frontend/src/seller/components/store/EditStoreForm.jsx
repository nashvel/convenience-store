import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaStore, FaClock, FaMapMarkerAlt, FaMapPin } from 'react-icons/fa';
import MapModal from './MapModal';

const Card = ({ children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
        {children}
    </div>
);

const CardHeader = ({ icon, title }) => (
    <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full mr-4">{icon}</div>
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
    </div>
);

const FormGroup = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-2">{label}</label>
        {children}
    </div>
);

const Input = (props) => (
    <input {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed" />
);

const EditStoreForm = ({ storeData, isEditing, position, handleInputChange, setPosition, setStoreData }) => {
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ').filter(Boolean);
        if (words.length > 1) {
            return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    const [isMapModalOpen, setMapModalOpen] = useState(false);

    if (!storeData) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <Card>
                    <CardHeader icon={<FaStore />} title="Store Details" />
                    <FormGroup label="Store Name">
                        <Input type="text" name="storeName" value={storeData.storeName} onChange={handleInputChange} disabled={!isEditing} />
                    </FormGroup>
                    <FormGroup label="Store Type">
                        <Input type="text" name="storeType" value={storeData.store_type.charAt(0).toUpperCase() + storeData.store_type.slice(1)} disabled />
                    </FormGroup>
                    <FormGroup label="Store Logo">
                        <div className="flex items-center gap-4">
                            {storeData.logo ? (
                                <img src={storeData.logo} alt="Store Logo" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-100">
                                    {getInitials(storeData.storeName)}
                                </div>
                            )}
                            {isEditing && (
                                <label htmlFor="logo-upload" className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Change Logo
                                </label>
                            )}
                            <input id="logo-upload" name="logo" type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
                        </div>
                    </FormGroup>
                </Card>

                <Card>
                    <CardHeader icon={<FaClock />} title="Operating Hours" />
                    <FormGroup label="Opening & Closing Time">
                        <div className="flex gap-4">
                            <Input type="time" name="openingTime" value={storeData.openingTime} onChange={handleInputChange} disabled={!isEditing} />
                            <Input type="time" name="closingTime" value={storeData.closingTime} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                    </FormGroup>
                </Card>

                <Card>
                    <CardHeader icon={<FaMapMarkerAlt />} title="Location & Contact" />
                    <FormGroup label="Contact Number">
                        <Input type="tel" name="contactNumber" value={storeData.contactNumber} onChange={handleInputChange} disabled={!isEditing} />
                    </FormGroup>
                    <FormGroup label="Payment Methods">
                        <Input type="text" name="paymentMethods" value={storeData.paymentMethods} onChange={handleInputChange} disabled={!isEditing} placeholder="e.g., Visa, Mastercard, PayPal" />
                    </FormGroup>
                    <FormGroup label="Address">
                        <div className="flex items-center gap-2">
                            <Input type="text" name="address" value={storeData.address} onChange={handleInputChange} disabled={!isEditing} />
                            {isEditing && (
                                <button type="button" onClick={() => setMapModalOpen(true)} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
                                    <FaMapPin />
                                </button>
                            )}
                        </div>
                    </FormGroup>
                </Card>

                <div className="lg:col-span-2 xl:col-span-3">
                    <Card>
                        <CardHeader icon={<FaStore />} title="Store Description" />
                        <FormGroup label="Store Description">
                            <textarea
                                name="description"
                                value={storeData.description || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                                rows="4"
                                placeholder="Tell us about your store..."
                            />
                        </FormGroup>
                    </Card>
                </div>
            </div>

            <MapModal
                isOpen={isMapModalOpen}
                onClose={() => setMapModalOpen(false)}
                position={position}
                setPosition={setPosition}
                setStoreData={setStoreData}
            />
        </>
    );
};

export default EditStoreForm;

