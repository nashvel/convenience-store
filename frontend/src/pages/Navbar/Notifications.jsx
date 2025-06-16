import React from 'react';
import styled from 'styled-components';

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
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const Notifications = () => {
  // Placeholder data
  const notifications = [
    {
      id: 1,
      message: 'Your order #ORD12345 has been delivered!',
      date: '2025-06-16',
      read: false,
    },
    {
      id: 2,
      message: 'Special offer: Get 20% off on all snacks this weekend.',
      date: '2025-06-15',
      read: true,
    },
  ];

  return (
    <NotificationsContainer>
      <Title>Notifications</Title>
      <NotificationList>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem key={notification.id} style={{ opacity: notification.read ? 0.6 : 1 }}>
              <p>{notification.message}</p>
              <small>{notification.date}</small>
            </NotificationItem>
          ))
        ) : (
          <p>You have no new notifications.</p>
        )}
      </NotificationList>
    </NotificationsContainer>
  );
};

export default Notifications;
