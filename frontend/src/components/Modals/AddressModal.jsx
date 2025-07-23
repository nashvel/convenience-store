import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner, FaTimes, FaHome, FaBriefcase, FaSearch, FaMap, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddressSelectorModal from './AddressSelectorModal';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};



const AddressModal = ({ isOpen, onClose, onSave, initialAddress, addressLabel }) => {
  const [address, setAddress] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]); // Default to Manila
  const [selectedPosition, setSelectedPosition] = useState(null);
  const searchTimeoutRef = useRef(null);
  
  // Address selection states
  const [addressSelectionMethod, setAddressSelectionMethod] = useState(''); // 'select' or 'map'
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [selectedAddressData, setSelectedAddressData] = useState(null);

  useEffect(() => {
    const initialAddr = initialAddress || {
      full_name: '',
      region: '',
      province: '',
      city: '',
      barangay: '',
      zipCode: '',
      phone: '',
      type: 'home',
      latitude: null,
      longitude: null,
    };
    setAddress(initialAddr);
    
    // Set selected address data if exists
    if (initialAddr.region && initialAddr.province && initialAddr.city && initialAddr.barangay) {
      setSelectedAddressData({
        region: initialAddr.region,
        province: initialAddr.province,
        city: initialAddr.city,
        barangay: initialAddr.barangay,
        fullAddress: `${initialAddr.barangay}, ${initialAddr.city}, ${initialAddr.province}, ${initialAddr.region}`
      });
      setAddressSelectionMethod('select');
    }
    
    // Set map center and marker if coordinates exist
    if (initialAddr.latitude && initialAddr.longitude) {
      setMapCenter([initialAddr.latitude, initialAddr.longitude]);
      setSelectedPosition([initialAddr.latitude, initialAddr.longitude]);
      if (!initialAddr.region) {
        setAddressSelectionMethod('map');
      }
    }
  }, [initialAddress, isOpen]);
  
  // Handle address selection method
  const handleAddressMethodSelect = (method) => {
    setAddressSelectionMethod(method);
    if (method === 'select') {
      setShowAddressSelector(true);
      setShowMap(false);
    } else if (method === 'map') {
      setShowMap(true);
      setSelectedAddressData(null);
    }
  };
  
  // Handle address selector save
  const handleAddressSelectorSave = (addressData) => {
    setSelectedAddressData(addressData);
    setAddress(prev => ({
      ...prev,
      region: addressData.region,
      province: addressData.province,
      city: addressData.city,
      barangay: addressData.barangay
    }));
    setAddressSelectionMethod('select');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
        setMapCenter([latitude, longitude]);
        setSelectedPosition([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.address) {
        setAddress(prev => ({
          ...prev,
          province: data.address.state || data.address.county || '',
          city: data.address.city || data.address.town || '',
          zipCode: data.address.postcode || '',
          latitude: lat,
          longitude: lng,
        }));
        toast.success('Location found!');
      } else {
        toast.error('Could not determine address from location.');
      }
    } catch (error) {
      toast.error('Failed to fetch address details.');
    }
  };

  const handleMapLocationSelect = async (lat, lng) => {
    setSelectedPosition([lat, lng]);
    setMapCenter([lat, lng]);
    await reverseGeocode(lat, lng);
  };

  const handleAddressSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        setMapCenter([lat, lng]);
        setSelectedPosition([lat, lng]);
        
        // Update address fields
        setAddress(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        
        toast.success('Address found on map!');
      } else {
        toast.error('Address not found. Please try a different search.');
      }
    } catch (error) {
      toast.error('Failed to search address.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleAddressSearch(query);
      }, 1000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate based on selection method
    if (addressSelectionMethod === 'select') {
      if (!address.full_name || !selectedAddressData || !address.zipCode || !address.phone) {
        toast.error('Please fill in all required fields and select an address.');
        return;
      }
    } else if (addressSelectionMethod === 'map') {
      if (!address.full_name || !address.latitude || !address.longitude || !address.zipCode || !address.phone) {
        toast.error('Please fill in all required fields and select a location on the map.');
        return;
      }
    } else {
      toast.error('Please select an address method.');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(address);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-50%', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '50%', opacity: 0 },
  };

  return (
    <>
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            >
              <motion.div
                className={`bg-white rounded-xl shadow-2xl w-full ${showMap ? 'max-w-2xl' : 'max-w-md'} mx-4 relative overflow-hidden transition-all duration-300`}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{addressLabel || 'Edit Address'}</h2>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={onClose} 
                        className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    className="w-full flex items-center justify-center px-4 py-3 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLocating}
                  >
                    {isLocating ? <FaSpinner className="animate-spin mr-2" /> : <FaMapMarkerAlt className="mr-2" />} 
                    {isLocating ? 'Locating...' : 'Locate Me'}
                  </button>

                  {/* Map Section */}
                  {showMap && (
                    <div className="mb-6">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Address on Map</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            placeholder="Search for an address..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          {isSearching && (
                            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin" />
                          )}
                        </div>
                      </div>
                      
                      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                        <MapContainer
                          center={mapCenter}
                          zoom={15}
                          style={{ height: '100%', width: '100%' }}
                          key={`${mapCenter[0]}-${mapCenter[1]}`}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <MapClickHandler onLocationSelect={handleMapLocationSelect} />
                          {selectedPosition && (
                            <Marker position={selectedPosition}>
                              <Popup>
                                Selected Location<br />
                                Lat: {selectedPosition[0].toFixed(6)}<br />
                                Lng: {selectedPosition[1].toFixed(6)}
                              </Popup>
                            </Marker>
                          )}
                        </MapContainer>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Click on the map to select your preferred pickup location. 
                        {address.latitude && address.longitude && (
                          <span className="text-blue-600">
                            Current: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="full_name" 
                        value={address.full_name || ''} 
                        onChange={handleChange} 
                        placeholder="Enter your full name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                        required 
                      />
                    </div>
                    
                    {/* Address Selection Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to set your address?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleAddressMethodSelect('select')}
                          className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 h-20 ${
                            addressSelectionMethod === 'select'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <FaList className="text-xl" />
                          <span className="font-medium mt-1 text-sm">Select Address</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddressMethodSelect('map')}
                          className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 h-20 ${
                            addressSelectionMethod === 'map'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <FaMapMarkerAlt className="text-xl" />
                          <span className="font-medium mt-1 text-sm">Point on Map</span>
                        </button>
                      </div>
                    </div>

                    {/* Selected Address Display */}
                    {selectedAddressData && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-600" />
                          Selected Address:
                        </h4>
                        <p className="text-sm text-green-700">{selectedAddressData.fullAddress}</p>
                        <button
                          type="button"
                          onClick={() => handleAddressMethodSelect('select')}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Change Address
                        </button>
                      </div>
                    )}

                    {/* Map Location Display */}
                    {addressSelectionMethod === 'map' && address.latitude && address.longitude && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <FaMap className="text-blue-600" />
                          Selected Location:
                        </h4>
                        <p className="text-sm text-blue-700">
                          Coordinates: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input 
                          type="text" 
                          name="zipCode" 
                          value={address.zipCode || ''} 
                          onChange={handleChange} 
                          placeholder="Enter ZIP code" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={address.phone || ''} 
                          onChange={handleChange} 
                          placeholder="Enter phone number" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={address.phone || ''} 
                        onChange={handleChange} 
                        placeholder="Enter phone number" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                    <div className="flex gap-3">
                      <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer flex-1 transition-all duration-200 ${address.type === 'home' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="type" value="home" checked={address.type === 'home'} onChange={handleChange} className="sr-only" />
                        <FaHome className={`mr-2 ${address.type === 'home' ? 'text-blue-600' : 'text-gray-500'}`} /> 
                        <span className="font-medium">Home</span>
                      </label>
                      <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer flex-1 transition-all duration-200 ${address.type === 'office' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="type" value="office" checked={address.type === 'office'} onChange={handleChange} className="sr-only" />
                        <FaBriefcase className={`mr-2 ${address.type === 'office' ? 'text-blue-600' : 'text-gray-500'}`} /> 
                        <span className="font-medium">Office</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button 
                      type="button" 
                      onClick={onClose} 
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Address'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSave={handleAddressSelectorSave}
        initialAddress={selectedAddressData}
      />
    </>
  );
};

export default AddressModal;
