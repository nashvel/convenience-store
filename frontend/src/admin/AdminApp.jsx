import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignIn from '../pages/Auth/SignIn';
import AppLayout from './layout/AppLayout';
import Home from './pages/Dashboard/Home.jsx';

function AdminApp() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Standalone sign-in routes */}
        <Route index element={<SignIn />} />
        <Route path="signin" element={<SignIn />} />

        {/* Dashboard routes wrapped in the main layout */}
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Home />} />
          {/* Add other dashboard pages here, e.g., <Route path="products" element={<Products />} /> */}
        </Route>
      </Routes>
    </HelmetProvider>
  );
}

export default AdminApp;
