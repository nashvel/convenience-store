import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios-config';
import { useAuth } from './AuthContext';
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
            const response = await api.get(`/notifications?userId=${user.id}`);
            
        if (response.data.success) {
                const fetchedNotifications = response.data.notifications || [];
        setNotifications(fetchedNotifications);
        const unread = fetchedNotifications.filter(n => !n.is_read || n.is_read === 'false' || n.is_read === '0').length;
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

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const response = await api.post(`/notifications/mark-as-read/${notificationId}`);
      if (response.data.success) {
        const updatedNotifications = notifications.map(n =>
          n.id.toString() === notificationId.toString() ? { ...n, is_read: true } : n
        );
        setNotifications(updatedNotifications);
        const newUnreadCount = updatedNotifications.filter(n => !n.is_read || n.is_read === 'false' || n.is_read === '0').length;
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [notifications]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (unreadCount === 0) return;
    try {
      const response = await api.post(`/notifications/mark-as-read`);
      if (response.data.success) {
        const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      fetchNotifications(); // Refetch to ensure consistency
    }
  }, [notifications, unreadCount, fetchNotifications]);

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
            await api.put(`/notifications/mark-all-read`, { userId: user.id });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
            await api.put(`/notifications/mark-read/${notificationId}`);
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
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
