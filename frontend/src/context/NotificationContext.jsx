import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';
import eventEmitter from '../utils/event-emitter';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notifications?userId=${user.id}`);
      if (response.data.success) {
        const fetchedNotifications = response.data.notifications || [];
        setNotifications(fetchedNotifications);
        const unread = fetchedNotifications.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle user changes and new notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }

    const handleNewNotification = () => {
      console.log('[NotificationContext.jsx] Received newNotification event, fetching notifications.');
      fetchNotifications();
    };

    // Subscribe to notification events
    eventEmitter.subscribe('newNotification', handleNewNotification);
    
    // Also listen for the event directly from the backend
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'newNotification') {
        console.log('[NotificationContext.jsx] Received new notification via message event');
        fetchNotifications();
      }
    });

    return () => {
      eventEmitter.unsubscribe('newNotification', handleNewNotification);
      window.removeEventListener('message', handleNewNotification);
    };
  }, [user, fetchNotifications]);

    const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, { userId: user.id });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-read/${notificationId}`);
      // Optimistically update the UI
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
