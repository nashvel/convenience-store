import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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

  const NotificationContent = ({ notification }) => (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5 ${notification.is_read ? 'opacity-60' : ''}`}>
      <p>{notification.message}</p>
      <small className="text-gray-500">{new Date(notification.created_at).toLocaleString()}</small>
    </div>
  );

  return (
    <div className="py-16 px-8 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Notifications</h1>
      <div className="text-left">
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notifications.length > 0 ? (
          notifications.map(notification => {
            const orderId = getOrderId(notification.message);
            return orderId ? (
              <Link to={`/my-orders/${orderId}`} key={notification.id} className="no-underline text-inherit">
                <NotificationContent notification={notification} />
              </Link>
            ) : (
              <NotificationContent key={notification.id} notification={notification} />
            );
          })
        ) : (
          <p>You have no new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
