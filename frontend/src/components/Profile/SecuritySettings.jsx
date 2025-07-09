import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    setIsChanged(currentPassword !== '' || newPassword !== '' || confirmPassword !== '');
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('/api/password/change', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (response.data.status === 'success') {
        toast.success('Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.messages?.error || error.response?.data?.message || 'An error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h2>
      <p className="mb-6 text-gray-500">For your security, we recommend using a strong password.</p>

      <div className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div className="mt-8 border-t pt-6 flex justify-end">
        <button 
          type="submit" 
          disabled={!isChanged}
          className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Update Password
        </button>
      </div>
    </form>
  );
};

export default SecuritySettings;
