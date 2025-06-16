import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaStore, FaTachometerAlt, FaBoxOpen, FaChevronDown, FaPlusCircle, FaTasks, FaClipboardList, FaComments, FaBars, FaTimes, FaStar, FaCog, FaClock, FaCalendarAlt } from 'react-icons/fa';

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

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.shadows.dark};
`;

const ClockContainer = styled.div`
  padding: 0 5px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, padding-bottom 0.4s ease-in-out;
  max-height: ${({ $isHidden }) => ($isHidden ? '0' : '140px')};
  opacity: ${({ $isHidden }) => ($isHidden ? '0' : '1')};
  padding-bottom: ${({ $isHidden }) => ($isHidden ? '0' : '20px')};
`;

const CalendarBox = styled.div`
  ${({ theme }) => theme.neumorphism(false, '10px')};
  padding: 8px;
  border-radius: 10px;
  text-align: center;
  width: 90px;
  
  .month {
    font-size: 0.7rem;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
  }
  .day {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
`;

const WatchDisplay = styled.div`
  ${({ theme }) => theme.neumorphism(false, '50%')};
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .time {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
  .ampm {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const AutoCloseContainer = styled.div`
  padding: 20px 5px 0 5px;
  border-top: 1px solid ${({ theme }) => theme.shadows.dark};
`;

const AutoCloseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  input { opacity: 0; width: 0; height: 0; }
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.shadows.dark};
    transition: .4s;
    border-radius: 34px;
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  input:checked + span { background-color: ${({ theme }) => theme.primary}; }
  input:checked + span:before { transform: translateX(22px); }
`;

const Sidebar = ({ activeView, setActiveView }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);
  const [isAutoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleToggleAutoClose = () => {
    const newIsEnabled = !isAutoCloseEnabled;
    setAutoCloseEnabled(newIsEnabled);
    if (newIsEnabled) {
      toast.info('Store is now closed.');
    } else {
      toast.success('Store is now open!');
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleSetActiveView = (view) => {
    setActiveView(view);
    // Close the products dropdown if a non-product view is selected
    if (!['manageProducts', 'addProduct'].includes(view)) {
      setProductsOpen(false);
    }
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
          $isActive={activeView === 'orders'}
          onClick={() => handleSetActiveView('orders')}
          $isCollapsed={isCollapsed}
        >
          <FaClipboardList />
          <span>Orders</span>
        </MenuButton>

        <MenuButton
          $isActive={activeView === 'reviews'}
          onClick={() => handleSetActiveView('reviews')}
          $isCollapsed={isCollapsed}
        >
          <FaStar size={20} />
          <span>Reviews</span>
        </MenuButton>

        <MenuButton
          $isActive={activeView === 'chat'}
          onClick={() => handleSetActiveView('chat')}
          $isCollapsed={isCollapsed}
        >
          <FaComments />
          <span>Chat</span>
        </MenuButton>

        <MenuButton
          $isActive={activeView === 'manageStore'}
          onClick={() => handleSetActiveView('manageStore')}
          $isCollapsed={isCollapsed}
        >
          <FaCog />
          <span>Manage Store</span>
        </MenuButton>

        <SidebarFooter>
          <ClockContainer $isHidden={isProductsOpen || isCollapsed}>
            <CalendarBox>
              <div className="month">{currentTime.toLocaleDateString(undefined, { month: 'long' }).toUpperCase()}</div>
              <div className="day">{currentTime.getDate()}</div>
            </CalendarBox>
            <WatchDisplay>
              <div className="time">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}</div>
              <div className="ampm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[1]}</div>
            </WatchDisplay>
          </ClockContainer>
          <AutoCloseContainer>
            <AutoCloseHeader>
              <span style={{ display: isCollapsed ? 'none' : 'block' }}>Close Store</span>
              <ToggleSwitch>
                <input type="checkbox" checked={isAutoCloseEnabled} onChange={handleToggleAutoClose} />
                <span />
              </ToggleSwitch>
            </AutoCloseHeader>
          </AutoCloseContainer>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
