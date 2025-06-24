import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import AddressModal from '../Modals/AddressModal';
import AddressSelectionModal from '../Modals/AddressSelectionModal';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const AddressSelector = ({ onSelectAddress, user }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [currentSlotLabel, setCurrentSlotLabel] = useState('');

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/addresses`, { withCredentials: true });
      if (response.data && response.data.addresses) {
        const fetchedAddresses = response.data.addresses;
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0) {
          const defaultAddress = fetchedAddresses.find(addr => addr.is_default);
          const addressToSelect = defaultAddress || fetchedAddresses[0];
          setSelectedAddress(addressToSelect);
          onSelectAddress(addressToSelect);
        } else {
          setSelectedAddress(null);
          onSelectAddress(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error.response || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [user]);

  const handleSaveAddress = async (addressData) => {
    try {
      const payload = { ...addressData, label: currentSlotLabel, zip_code: addressData.zipCode };
      let response;
      if (editingAddress) {
        response = await axios.put(`${API_BASE_URL}/addresses/${editingAddress.id}`, payload, { withCredentials: true });
        toast.success('Address updated successfully!');
      } else {
        response = await axios.post(`${API_BASE_URL}/addresses`, payload, { withCredentials: true });
        toast.success('Address added successfully!');
      }
      
      setIsEditModalOpen(false);
      setEditingAddress(null);
      await fetchAddresses(); // Refetch to get the latest list

      if (response.data && response.data.address) {
        setSelectedAddress(response.data.address);
        onSelectAddress(response.data.address);
      }
    } catch (error) {
      console.error('Failed to save address:', error.response || error.message);
      toast.error('Failed to save address. Check console for details.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`${API_BASE_URL}/addresses/${addressId}`, { withCredentials: true });
        toast.success('Address deleted successfully!');
        
        if (selectedAddress && selectedAddress.id === addressId) {
            setSelectedAddress(null);
            onSelectAddress(null);
        }
        
        await fetchAddresses();
      } catch (error) {
        toast.error('Failed to delete address.');
      }
    }
  };

  const handleAddNewAddress = () => {
    setIsSelectionModalOpen(false);
    setEditingAddress(null);
    const nextLabel = `Address ${addresses.length + 1}`;
    setCurrentSlotLabel(nextLabel);
    setIsEditModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setIsSelectionModalOpen(false);
    setEditingAddress(address);
    setCurrentSlotLabel(address.label);
    setIsEditModalOpen(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
      
      {addresses.length === 0 ? (
        <div className="text-center p-4 border-2 border-dashed rounded-lg">
          <p className="text-gray-600">You don't have a delivery address yet.</p>
          <button 
            onClick={handleAddNewAddress} 
            className="mt-2 text-primary font-semibold hover:underline"
          >
            Add an address
          </button>
        </div>
      ) : (
        <div className="p-4 border rounded-lg flex justify-between items-center">
          {selectedAddress ? (
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">{selectedAddress.full_name}</p>
                <p className="text-sm text-gray-600">{`${selectedAddress.province}, ${selectedAddress.city}, ${selectedAddress.zip_code}`}</p>
                <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Please select a delivery address.</p>
          )}
          <button 
            onClick={() => setIsSelectionModalOpen(true)} 
            className="text-primary font-semibold hover:underline flex-shrink-0 ml-4"
          >
            {selectedAddress ? 'Change' : 'Select Address'}
          </button>
        </div>
      )}

      <AddressSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(address) => {
            setSelectedAddress(address);
            onSelectAddress(address);
            setIsSelectionModalOpen(false);
        }}
        onAddNewAddress={handleAddNewAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      <AddressModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
        addressLabel={editingAddress ? 'Edit Address' : 'Add New Address'}
      />
    </div>
  );
};

export default AddressSelector;
