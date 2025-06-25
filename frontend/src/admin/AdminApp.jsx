import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Dashboard/Home.jsx';
import UserProfiles from './pages/UserProfiles.jsx';
import UserRoles from './pages/UserRoles.jsx';
import AddClient from './pages/UserManagement/AddClient.jsx';
import AddRider from './pages/UserManagement/AddRider.jsx';
import Blank from './pages/Blank.jsx';
import SiteContent from './pages/AppManagement/SiteContent.jsx';
import Branding from './pages/AppManagement/Branding.jsx';
import AboutUs from './pages/AppManagement/AboutUs.jsx';
import AdminChat from './pages/Chat/AdminChat.jsx';
import ClientChat from './pages/Chat/ClientChat.jsx';
import StoreChat from './pages/Chat/StoreChat.jsx';

function AdminApp() {
  return (
    <Routes>
      {/* Admin Dashboard routes wrapped in the main layout */}
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        
        {/* User Management */}
        <Route path="user-profiles" element={<UserProfiles />} />
        <Route path="user-roles" element={<UserRoles />} />
        <Route path="add-client" element={<AddClient />} />
        <Route path="add-rider" element={<AddRider />} />
        
        {/* App Management */}
        <Route path="site-content" element={<SiteContent />} />
        <Route path="branding" element={<Branding />} />
        <Route path="about-us" element={<AboutUs />} />
        
        {/* Chat Management */}
        <Route path="chat/admin" element={<AdminChat />} />
        <Route path="chat/client" element={<ClientChat />} />
        <Route path="chat/store" element={<StoreChat />} />
        
        {/* Others */}
        <Route path="blank" element={<Blank />} />
      </Route>
    </Routes>
  );
}

export default AdminApp;
