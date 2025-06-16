import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SellerHome from './components/SellerHome';
import ManageProducts from './components/ManageProducts';
import AddProduct from './components/AddProduct';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import Chat from './components/Chat';
import ManageStore from './components/ManageStore';
import ViewSales from './components/ViewSales';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ContentArea = styled.div`
  padding: 30px;
  flex-grow: 1;
`;

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
    <DashboardContainer>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <MainContent>
        <Header />
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default SellerDashboard;
