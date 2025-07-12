import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';

const SellerLayout = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen bg-gray-100 font-sans">
      <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
