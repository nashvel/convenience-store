import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import NotificationSkeleton from '../../components/Skeletons/NotificationSkeleton';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaShoppingBag } from 'react-icons/fa';

const Notifications = () => {
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications();

  const getOrderId = (message) => {
    const match = message.match(/order #(\d+)/i);
    return match ? match[1] : null;
  };

  const getNotificationIcon = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('delivered') || lowerCaseMessage.includes('completed')) {
      return <FaCheckCircle className="text-green-500" />;
    }
    if (lowerCaseMessage.includes('cancelled') || lowerCaseMessage.includes('rejected')) {
      return <FaTimesCircle className="text-red-500" />;
    }
    if (lowerCaseMessage.includes('order placed') || lowerCaseMessage.includes('assigned')) {
      return <FaShoppingBag className="text-blue-500" />;
    }
    return <FaInfoCircle className="text-gray-500" />;
  };

    useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadCount]);

  const NotificationItem = ({ notification }) => {
    const orderId = getOrderId(notification.message);
    const content = (
      <div className={`flex items-start p-4 transition-colors duration-200 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : 'bg-white'}`}>
        <div className="flex-shrink-0 w-8 text-center pt-1">
          {getNotificationIcon(notification.message)}
        </div>
        <div className="ml-4 flex-grow">
          <p className="text-sm text-gray-700">{notification.message}</p>
          <small className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</small>
        </div>
        {!notification.is_read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full self-center ml-4"></div>
        )}
      </div>
    );

    return orderId ? (
      <Link to={`/my-orders/${orderId}`} className="no-underline text-inherit block">
        {content}
      </Link>
    ) : (
      content
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have {unreadCount} unread notifications.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <NotificationSkeleton key={index} />)
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="p-8 text-center">
                <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No new notifications</h3>
                <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
