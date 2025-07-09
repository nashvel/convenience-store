import React, { useState, useEffect } from 'react';
import SettingsPageSkeleton from '../skeletons/SettingsPageSkeleton';

const AccountInformation = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SettingsPageSkeleton />;
  }

  return (
  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
    <p className="mt-4 text-gray-600">This page will contain a form to edit your account details.</p>
  </div>
  );
};

export default AccountInformation;
