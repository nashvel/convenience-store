import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      };
      setFormData(userData);
      setInitialData(userData);
    }
  }, [user]);

  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    try {
      const response = await axios.post('/api/profile/update', {
        firstName: formData.firstName,
        lastName: formData.lastName,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (response.data.status === 'success') {
        toast.success('Profile updated successfully!');
        updateUser(response.data.user); // Update global user state
        setInitialData(formData);
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while updating your profile.';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <p className="text-gray-500">Update your personal details here.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} disabled className="w-full p-3 text-base rounded-md border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          <div className="mt-8 border-t pt-6 flex justify-end gap-4">
            <button type="button" onClick={handleCancel} className="px-6 py-3 text-base font-bold rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={!isChanged} className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">First Name</h3>
            <p className="text-lg text-gray-800">{formData.firstName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
            <p className="text-lg text-gray-800">{formData.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
            <p className="text-lg text-gray-800">{formData.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
