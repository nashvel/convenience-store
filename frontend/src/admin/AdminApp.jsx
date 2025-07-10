import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Dashboard/Home.jsx';
import UserProfiles from './pages/UserProfiles.jsx';
import UserRoles from './pages/UserRoles.jsx';
import AddClient from './pages/UserManagement/AddClient.jsx';
import AddRider from './pages/UserManagement/AddRider.jsx';
import Clients from './pages/UserManagement/Clients.jsx';
import Customers from './pages/UserManagement/Customers.jsx';
import Riders from './pages/UserManagement/Riders.jsx';
import Blank from './pages/Blank.jsx';
import AppHome from './pages/AppManagement/AppHome';
import AppPreview from './pages/AppManagement/AppPreview';
import AppSupport from './pages/AppManagement/AppSupport';
import ManagePromotions from './pages/AppManagement/ManagePromotions.jsx';
import SiteSettings from './pages/AppManagement/SiteSettings.jsx';
import AdminChat from './pages/Chat/AdminChat.jsx';
import ClientChat from './pages/Chat/ClientChat.jsx';
import StoreChat from './pages/Chat/StoreChat.jsx';
import ProductList from './pages/ProductManagement/ProductList.jsx';
import ApprovalQueue from './pages/ProductManagement/ApprovalQueue.jsx';
import SalesOverview from './pages/SalesAnalytics/SalesOverview.jsx';
import ClientReports from './pages/SalesAnalytics/ClientReports.jsx';
import RiderEarnings from './pages/SalesAnalytics/RiderEarnings.jsx';
import BestSellers from './pages/SalesAnalytics/BestSellers.jsx';
import GeneralSettings from './pages/Settings/GeneralSettings.jsx';
import ApiLogging from './pages/Settings/ApiLogging.jsx';
import ReviewManagement from './pages/Settings/ReviewManagement.jsx';
import Blacklist from './pages/Settings/Blacklist.jsx';
import DeliveryRates from './pages/Settings/DeliveryRates.jsx';

function AdminApp() {
  return (
    <Routes>
      {/* Admin Dashboard routes wrapped in the main layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        
        {/* User Management */}
        <Route path="user-profiles" element={<UserProfiles />} />
        <Route path="user-roles" element={<UserRoles />} />
        <Route path="add-client" element={<AddClient />} />
        <Route path="add-rider" element={<AddRider />} />
        <Route path="clients" element={<Clients />} />
        <Route path="customers" element={<Customers />} />
        <Route path="riders" element={<Riders />} />

        {/* Product Management */}
        <Route path="product-list" element={<ProductList />} />
        <Route path="approval-queue" element={<ApprovalQueue />} />

        {/* Sales & Analytics */}
        <Route path="sales-overview" element={<SalesOverview />} />
        <Route path="client-reports" element={<ClientReports />} />
        <Route path="rider-earnings" element={<RiderEarnings />} />
        <Route path="best-sellers" element={<BestSellers />} />

        {/* Settings */}
        <Route path="settings-general" element={<GeneralSettings />} />
        <Route path="settings-api" element={<ApiLogging />} />
        <Route path="settings-reviews" element={<ReviewManagement />} />
        <Route path="settings-blacklist" element={<Blacklist />} />
        <Route path="settings-delivery-rates" element={<DeliveryRates />} />
        
        {/* App Management */}
        <Route path="app-home" element={<AppHome />} />
        <Route path="app-preview" element={<AppPreview />} />
        <Route path="app-support" element={<AppSupport />} />
        <Route path="manage-promotions" element={<ManagePromotions />} />
        <Route path="site-settings" element={<SiteSettings />} />
        
        {/* Chat Management */}
        <Route path="chat/admin" element={<AdminChat />} />
        <Route path="chat/client" element={<ClientChat />} />
        <Route path="chat/store" element={<StoreChat />} />
        
        {/* Others */}
        <Route path="blank" element={<Blank />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminApp;
