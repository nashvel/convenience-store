import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner, FaTimes, FaHome, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddressModal = ({ isOpen, onClose, onSave, initialAddress, addressLabel }) => {
  const [address, setAddress] = useState({});
  const [isLocating, setIsLocating] = useState(false);

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
              province: data.address.state || '',
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

  const handleSave = (e) => {
    e.preventDefault();
    if (!address.full_name || !address.province || !address.city || !address.zipCode || !address.phone) {
      toast.error('Please fill in all required address fields.');
      return;
    }
    onSave(address);
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
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{addressLabel || 'Delivery Address'}</h2>
            <form onSubmit={handleSave}>
              <button
                type="button"
                onClick={handleLocateMe}
                className="w-full flex items-center justify-center px-4 py-2 mb-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
                disabled={isLocating}
              >
                {isLocating ? <FaSpinner className="animate-spin mr-2" /> : <FaMapMarkerAlt className="mr-2" />} 
                {isLocating ? 'Locating...' : 'Locate Me'}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input type="text" name="full_name" value={address.full_name || ''} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <input type="text" name="province" value={address.province || ''} onChange={handleChange} placeholder="Province" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <input type="text" name="city" value={address.city || ''} onChange={handleChange} placeholder="City" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="col-span-2">
                  <input type="text" name="zipCode" value={address.zipCode || ''} onChange={handleChange} placeholder="ZIP Code" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="col-span-2">
                  <input type="tel" name="phone" value={address.phone || ''} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Address Type</p>
                <div className="flex gap-4">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 ${address.type === 'home' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                    <input type="radio" name="type" value="home" checked={address.type === 'home'} onChange={handleChange} className="sr-only" />
                    <FaHome className={`mr-2 ${address.type === 'home' ? 'text-primary' : 'text-gray-500'}`} /> Home
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer flex-1 ${address.type === 'office' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                    <input type="radio" name="type" value="office" checked={address.type === 'office'} onChange={handleChange} className="sr-only" />
                    <FaBriefcase className={`mr-2 ${address.type === 'office' ? 'text-primary' : 'text-gray-500'}`} /> Office
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Address</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddressModal;
