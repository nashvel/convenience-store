import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import AddProduct from '../components/AddProduct';
import ViewSales from '../components/ViewSales';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { neumorphicTheme } from '../styles/neumorphicTheme';
import ClientHome from '../components/ClientHome';
import ManageProducts from '../components/ManageProducts';
import Chat from '../components/Chat';

const DashboardLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
  position: relative;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
`;

const Content = styled.main`
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
  background: ${({ theme }) => theme.body};
`;

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ClientHome />;
      case 'manageProducts':
        return <ManageProducts />;
      case 'addProduct':
        return <AddProduct />;
      case 'viewSales':
        return <ViewSales />;
      case 'chat':
        return <Chat />;
      default:
        return <ClientHome />;
    }
  };

  return (
    <ThemeProvider theme={neumorphicTheme}>
      <DashboardLayout>
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <MainContentWrapper>
          <Header />
          <Content>
            {renderView()}
          </Content>
        </MainContentWrapper>
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default Dashboard;
