import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import SellerHome from '../components/home/SellerHome';
import ManageProducts from '../components/product/ManageProducts';
import AddProduct from '../components/product/AddProduct';
import Orders from '../components/orders/Orders';
import Reviews from '../components/reviews/Reviews';
import Chat from '../components/chat/Chat';
import ManageStore from '../components/store/ManageStore';
import ViewSales from '../components/sales/ViewSales';

const SellerDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <SellerHome />;
      case 'manageProducts':
        return <ManageProducts />;
      case 'addProduct':
        return <AddProduct />;
      case 'orders':
        return <Orders />;
      case 'reviews':
        return <Reviews />;
      case 'chat':
        return <Chat />;
      case 'manageStore':
        return <ManageStore />;
      case 'viewSales':
        return <ViewSales />;
      default:
        return <SellerHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
