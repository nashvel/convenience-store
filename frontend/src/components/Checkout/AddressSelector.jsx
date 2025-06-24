import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import AddressModal from '../Modals/AddressModal';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const AddressSelector = ({ onSelectAddress, user }) => {
  const [addresses, setAddresses] = useState([]);
  const [addressSlots, setAddressSlots] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);
  // Address fetching logic has been removed due to a 401 Unauthorized error.
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      setAddressSlots([]);
    }
  }, [user]);

  const handleOpenModal = (slot) => {
    setCurrentSlot(slot);
    setEditingAddress(slot.data);
    setIsModalOpen(true);
  };

  const handleInitialSetup = () => {
    const firstSlot = { id: 'new-1', label: 'Address 1', isFilled: false, data: null };
    handleOpenModal(firstSlot);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      const payload = {
        ...addressData,
        label: currentSlot.label,
        zip_code: addressData.zipCode
      };

      if (editingAddress) {
        await axios.put(`${API_BASE_URL}/addresses/${editingAddress.id}`, payload, { withCredentials: true });
        toast.success('Address updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/addresses`, payload, { withCredentials: true });
        toast.success('Address added successfully!');
      }
      // fetchAddresses();
      setIsModalOpen(false);
      setEditingAddress(null);
      setCurrentSlot(null);
    } catch (error) {
      toast.error('Failed to save address.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`${API_BASE_URL}/addresses/${addressId}`, { withCredentials: true });
        toast.success('Address deleted successfully!');
        // fetchAddresses();
      } catch (error) {
        toast.error('Failed to delete address.');
      }
    }
  };

  const handleAddMore = () => {
    const nextSlotNumber = addressSlots.length + 1;
    const newSlot = {
      id: `new-${nextSlotNumber}`,
      label: `Address ${nextSlotNumber}`,
      isFilled: false,
      data: null
    };
    setAddressSlots([...addressSlots, newSlot]);
  };



  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
      
      {addresses.length === 0 ? (
        <div className="text-center p-4 border-2 border-dashed rounded-lg">
          <p className="text-gray-600">You don't have an address yet.</p>
          <button 
            onClick={handleInitialSetup} 
            className="mt-2 text-primary font-semibold hover:underline"
          >
            Setup now?
          </button>
        </div>
      ) : (
        <>
          {addressSlots.map((slot) => (
            <div key={slot.id}>
              {slot.isFilled ? (
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between items-start ${selectedAddress?.id === slot.id ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}
                  onClick={() => {
                    setSelectedAddress(slot.data);
                    onSelectAddress(slot.data);
                  }}
                >
                  <div className="flex items-start">
                    {selectedAddress?.id === slot.id && <FaCheckCircle className="text-primary mr-3 mt-1" />}
                    <div>
                      <p className="font-semibold">{slot.label}</p>
                      <p className="text-sm text-gray-600">{slot.data.full_name}</p>
                      <p className="text-sm text-gray-600">{`${slot.data.province || slot.data.line1}, ${slot.data.city}, ${slot.data.zip_code}`}</p>
                      <p className="text-sm text-gray-600">{slot.data.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenModal(slot); }} className="text-gray-500 hover:text-primary"><FaEdit /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(slot.id); }} className="text-gray-500 hover:text-red-500"><FaTrash /></button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleOpenModal(slot)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-all"
                >
                  <FaPlus /> {`Add ${slot.label}`}
                </button>
              )}
            </div>
          ))}

          <button 
            onClick={handleAddMore}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-all"
          >
            <FaPlus /> Add More Address
          </button>
        </>
      )}

      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
        addressLabel={currentSlot ? `Add ${currentSlot.label}` : 'Address'}
      />
    </div>
  );
};

export default AddressSelector;
