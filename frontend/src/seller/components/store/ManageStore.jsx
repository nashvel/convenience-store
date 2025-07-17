import React, { useState, useEffect } from 'react';
import ManageStoreSkeleton from '../../skeleton/ManageStoreSkeleton';
import api from '../../../api/axios-config';
import { toast } from 'react-toastify';
import { FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTutorial } from '../../context/TutorialContext';
import EditStoreForm from './EditStoreForm';

const ManageStore = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [storeData, setStoreData] = useState(null);
    const [initialStoreData, setInitialStoreData] = useState({ storeName: '', openingTime: '', closingTime: '', contactNumber: '', paymentMethods: '', address: '', logo: '', latitude: null, longitude: null, description: '' });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { runTutorial, endTutorial } = useTutorial();

  const [tourSteps, setTourSteps] = useState([
    {
      target: '#edit-store-button',
      content: 'Click here to edit your store details and complete your profile.',
      placement: 'bottom',
    },
  ]);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update the step index
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      endTutorial();
    }
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get('/seller/store');
        const data = response.data;
        const formattedData = {
          id: data.id,
          storeName: data.name,
          logo: data.logo_url || null,
          openingTime: data.opening_time,
          closingTime: data.closing_time,
          contactNumber: data.contact_number,
          paymentMethods: data.payment_methods,
          address: data.address || '',
                    latitude: data.latitude,
          longitude: data.longitude,
          description: data.description || ''
        };
        setStoreData(formattedData);
        setInitialStoreData(formattedData);
        if (data.latitude && data.longitude) {
          setPosition({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        } else {
          // Default to Tagoloan, PH if no coordinates are available
          setPosition({ lat: 8.4836, lng: 124.7533 });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      setStoreData(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
    } else {
      setStoreData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setStoreData(initialStoreData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const dataToSave = {
      ...storeData,
      latitude: position ? position.lat : storeData.latitude,
      longitude: position ? position.lng : storeData.longitude,
    };
    try {
      const response = await api.put(`/seller/store/update/${storeData.id}`, dataToSave);
      if (response.status !== 200) {
        throw new Error('Failed to update store data.');
      }
      setInitialStoreData(dataToSave);
      setIsEditing(false);
      toast.success('Store details updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update store. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <ManageStoreSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Manage Store</h1>
        {isEditing ? (
          <div className="flex gap-4">
            <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
              <FaTimes />
              Cancel
            </button>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
              <FaSave />
              Save Changes
            </button>
          </div>
        ) : (
          <button id="edit-store-button" onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
            <FaEdit />
            Edit
          </button>
        )}
      </div>

            <EditStoreForm
        storeData={storeData}
        isEditing={isEditing}
        position={position}
        handleInputChange={handleInputChange}
        setPosition={setPosition}
        setStoreData={setStoreData}
      />
      <Joyride
        steps={tourSteps}
        run={runTutorial}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            primaryColor: ' #FF5722',
            textColor: '#333',
            zIndex: 1000,
          }
        }}
      />
    </div>
  );
};

export default ManageStore;
