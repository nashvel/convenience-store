import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStore, FaTachometerAlt, FaBoxOpen, FaChevronDown, FaPlusCircle, FaTasks, FaChartLine, FaComments, FaBars, FaTimes } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
  background: ${({ theme }) => theme.body};
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: width 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ $isOpenOnMobile }) => ($isOpenOnMobile ? '0' : '-100%')};
    width: 280px;
    z-index: 2000;
    height: 100%;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    transition: left 0.3s ease;
  }
`;

const ToggleButton = styled.button`
  ${({ theme }) => theme.neumorphism(false, '50%')};
  width: 40px;
  height: 40px;
  position: absolute;
  top: 30px;
  right: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 10;
  color: ${({ theme }) => theme.textSecondary};

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileToggleButton = styled(ToggleButton)`
  display: none;
  position: fixed;
  top: 25px;
  left: 25px;
  z-index: 3000;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const LogoContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 18px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  font-weight: 600;
  transition: all 0.2s ease;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};

  ${({ $isActive, theme }) => 
    $isActive 
      ? theme.neumorphismActive(theme.primary, '15px') 
      : theme.neumorphism(false, '15px')};
  
  color: ${({ $isActive, theme }) => ($isActive ? 'white' : theme.textSecondary)};

  &:hover {
    color: ${({ $isActive, theme }) => ($isActive ? 'white' : theme.primary)};
  }

  span {
    display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
  }
`;

const DropdownContainer = styled.div``;

const DropdownContent = styled.div`
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '200px' : '0')};
  transition: max-height 0.3s ease;
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '20px')};
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
`;

const Sidebar = ({ activeView, setActiveView }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);

  const handleSetActiveView = (view) => {
    setActiveView(view);
    if (window.innerWidth <= 768) {
      setOpenOnMobile(false);
    }
  };

  return (
    <>
      <MobileToggleButton onClick={() => setOpenOnMobile(!isOpenOnMobile)}>
        {isOpenOnMobile ? <FaTimes /> : <FaBars />}
      </MobileToggleButton>
      <SidebarContainer $isCollapsed={isCollapsed} $isOpenOnMobile={isOpenOnMobile}>
        <ToggleButton onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </ToggleButton>
        <LogoContainer>
          <FaStore />
          {!isCollapsed && <span>Admin</span>}
        </LogoContainer>

        <MenuButton
          $isActive={activeView === 'dashboard'}
          onClick={() => handleSetActiveView('dashboard')}
          $isCollapsed={isCollapsed}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </MenuButton>

        <DropdownContainer>
          <MenuButton
            onClick={() => setProductsOpen(!isProductsOpen)}
            $isCollapsed={isCollapsed}
            $isActive={['manageProducts', 'addProduct'].includes(activeView)}
          >
            <FaBoxOpen />
            <span>Products</span>
            {!isCollapsed && <FaChevronDown style={{ marginLeft: 'auto' }} />}
          </MenuButton>
          <DropdownContent $isOpen={isProductsOpen} $isCollapsed={isCollapsed}>
            <MenuButton
              $isActive={activeView === 'manageProducts'}
              onClick={() => handleSetActiveView('manageProducts')}
              $isCollapsed={isCollapsed}
            >
              <FaTasks />
              <span>Manage</span>
            </MenuButton>
            <MenuButton
              $isActive={activeView === 'addProduct'}
              onClick={() => handleSetActiveView('addProduct')}
              $isCollapsed={isCollapsed}
            >
              <FaPlusCircle />
              <span>Add New</span>
            </MenuButton>
          </DropdownContent>
        </DropdownContainer>

        <MenuButton
          $isActive={activeView === 'viewSales'}
          onClick={() => handleSetActiveView('viewSales')}
          $isCollapsed={isCollapsed}
        >
          <FaChartLine />
          <span>View Sales</span>
        </MenuButton>

        <MenuButton
          $isActive={activeView === 'chat'}
          onClick={() => handleSetActiveView('chat')}
          $isCollapsed={isCollapsed}
        >
          <FaComments />
          <span>Chat</span>
        </MenuButton>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
