import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUserProfileModal = ({ user, closeModal, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    line1: '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        line1: user.address?.line1 || '',
        city: user.address?.city || '',
        zipCode: user.address?.zip_code || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/admin/profile', formData, { withCredentials: true })
      .then(response => {
        onSaveSuccess(response.data);
        closeModal();
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
        // Optionally, show an error message to the user
      });
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" />
            <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="p-2 border rounded md:col-span-2" />

            {/* Address Info */}
            <input name="line1" value={formData.line1} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Postal Code" className="p-2 border rounded" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfileModal;
