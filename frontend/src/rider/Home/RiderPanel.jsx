import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import { getAvailableOrders } from '../../api/riderApi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import ActiveOrders from '../pages/ActiveOrders';
import OrderHistory from '../pages/OrderHistory';
import Profile from '../pages/Profile';
import AccountInformation from '../pages/AccountInformation';
import NotificationPreferences from '../pages/NotificationPreferences';
import HelpAndSupport from '../pages/HelpAndSupport';
import Achievements from '../pages/Achievements';
import BottomNavbar from '../components/BottomNavbar';

const RiderPanel = () => {
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAvailableOrders();
        setAvailableOrders(orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Simulate a new order arriving after 10 seconds
    const timer = setTimeout(() => {
      const newOrder = {
        id: 'ORD12349',
        storeName: 'New Snack Place',
        storeAddress: '456 Innovation Drive, Tech City',
        customerName: 'Alex Ray',
        deliveryAddress: '789 Future Lane, Metropolis',
        total: 180,
        status: 'Pending',
      };
      setAvailableOrders(prev => [newOrder, ...prev]);
      setNotificationCount(prev => prev + 1);
      
    }, 10000);

    return () => clearTimeout(timer); 

  }, []);

  const handleAcceptOrder = (orderId) => {
    const orderToMove = availableOrders.find(o => o.id === orderId);
    if (orderToMove) {
      setAvailableOrders(prev => prev.filter(o => o.id !== orderId));
      setActiveOrders(prev => [...prev, orderToMove]);
    }
  };

  const handleClearNotifications = () => {
    setNotificationCount(0);
  };

      if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated || user.role !== 'rider') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar notificationCount={notificationCount} onClearNotifications={handleClearNotifications} availableOrders={availableOrders} />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 ${location.pathname === '/rider/active-orders' ? 'p-0' : 'p-8'} pb-20 md:pb-8`}>
          <Routes>
            <Route path="/" element={<Dashboard availableOrders={availableOrders} loading={loading} handleAcceptOrder={handleAcceptOrder} />} />
            <Route path="/active-orders" element={<ActiveOrders />} />
            <Route path="/order-history" element={<OrderHistory />} />
                        <Route path="/profile" element={<Profile />} />
            <Route path="/account-information" element={<AccountInformation />} />
            <Route path="/notification-preferences" element={<NotificationPreferences />} />
            <Route path="/help-and-support" element={<HelpAndSupport />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </main>
        <BottomNavbar />
      </div>
      
    </div>
  );
};

export default RiderPanel;
