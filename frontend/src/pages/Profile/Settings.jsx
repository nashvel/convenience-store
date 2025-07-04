import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user ? {
    'admin': '/admin/dashboard',
    'client': '/seller/dashboard',
    'rider': '/rider/dashboard'
  }[user.role] : null;

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to update profile
    console.log('Updating profile:', profileData);
    alert('Profile update functionality not yet implemented.');
  };

    const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to update password
    console.log('Updating password');
    alert('Password update functionality not yet implemented.');
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto my-8 bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <div className="flex items-center gap-4">
          {dashboardPath && (
            <Link 
              to={dashboardPath} 
              className="bg-blue-600 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-blue-700 transition-colors no-underline"
            >
              Manage Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleProfileSubmit} className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Profile Information</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 mb-6 sm:mb-0">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input id="firstName" name="firstName" type="text" value={profileData.firstName} onChange={handleProfileChange} className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input id="lastName" name="lastName" type="text" value={profileData.lastName} onChange={handleProfileChange} className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} disabled className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          </div>
          <button type="submit" className="mt-8 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 text-base font-bold rounded-md hover:bg-blue-700 transition-colors">Save Profile</button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">Change Password</h2>
          <div className="mb-6">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full p-3 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="mt-2 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 text-base font-bold rounded-md hover:bg-blue-700 transition-colors">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
