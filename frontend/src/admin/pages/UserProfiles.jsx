import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from '../../context/AuthContext';

export default function UserProfiles() {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/profile', { withCredentials: true });
        setUser(response.data);
        updateUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Keep existing authUser data on failure
        setUser(authUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // We only want to run this on mount, not when authUser changes during the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSuccess = (updatedUserData) => {
    setUser(updatedUserData);
    updateUser(updatedUserData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <div>Failed to load user profile. Please try refreshing the page.</div>;
  }

  return (
    <>
      <PageMeta title="Admin Profile" />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} onSaveSuccess={handleSaveSuccess} />
          <UserInfoCard user={user} onSaveSuccess={handleSaveSuccess} />
          <UserAddressCard user={user} onSaveSuccess={handleSaveSuccess} />
        </div>
      </div>
    </>
  );
}
