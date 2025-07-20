import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner, FaTimes, FaHome, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress, addressLabel }) => {
  const [address, setAddress] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setAddress(initialAddress || {
      full_name: '',
      province: '',
      city: '',
      zipCode: '',
      phone: '',
      type: 'home',
      latitude: null,
      longitude: null,
    });
  }, [initialAddress, isOpen]);

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
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.address) {
            setAddress(prev => ({
              ...prev,
              province: data.address.state || data.address.county || '',
              city: data.address.city || data.address.town || '',
              zipCode: data.address.postcode || '',
              latitude,
              longitude,
            }));
            toast.success('Location found!');
          } else {
            toast.error('Could not determine address from location.');
          }
        } catch (error) {
          toast.error('Failed to fetch address details.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast.error('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!address.full_name || !address.province || !address.city || !address.zipCode || !address.phone) {
      toast.error('Please fill in all required address fields.');
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

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{addressLabel || 'Edit Address'}</h2>
                <button 
                  onClick={onClose} 
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <FaTimes size={18} />
                </button>
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
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <input 
                      type="text" 
                      name="province" 
                      value={address.province || ''} 
                      onChange={handleChange} 
                      placeholder="Province" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={address.city || ''} 
                      onChange={handleChange} 
                      placeholder="City" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      required 
                    />
                  </div>
                </div>
                
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
  );
};

export default AddressModal;
