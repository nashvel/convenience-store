import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const NotificationsContainer = styled.div`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

const NotificationList = styled.div`
  text-align: left;
`;

const NotificationItem = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  opacity: ${({ isRead }) => (isRead ? 0.6 : 1)};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const NotificationLink = styled(Link)`
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
`;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const getOrderId = (message) => {
    const match = message.match(/order #(\d+)/i);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError('');
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/notifications?userId=${user.id}`);
        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setError(response.data.message || 'Failed to fetch notifications.');
        }
      } catch (err) {
        setError('An error occurred while fetching notifications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <NotificationsContainer>
      <Title>Notifications</Title>
      <NotificationList>
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : notifications.length > 0 ? (
          notifications.map(notification => {
            const orderId = getOrderId(notification.message);
            const notificationContent = (
              <NotificationItem key={notification.id} isRead={notification.is_read}>
                <p>{notification.message}</p>
                <small>{new Date(notification.created_at).toLocaleString()}</small>
              </NotificationItem>
            );

            return orderId ? (
              <Link to={`/my-orders/${orderId}`} key={notification.id} style={{ textDecoration: 'none' }}>
                {notificationContent}
              </Link>
            ) : (
              notificationContent
            );
          })
        ) : (
          <p>You have no new notifications.</p>
        )}
      </NotificationList>
    </NotificationsContainer>
  );
};

export default Notifications;
