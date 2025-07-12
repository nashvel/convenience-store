import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SellerLayout = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen bg-white font-sans">
      <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
