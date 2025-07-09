import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaShoppingBag, FaEnvelopeOpenText } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationItem = ({ notification, onNotificationClick }) => {
    const isUnread = !notification.is_read || notification.is_read === 'false' || notification.is_read === '0';

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

    return (
        <div
            onClick={() => onNotificationClick(notification)}
            className={`flex items-start p-3 transition-all duration-200 cursor-pointer ${isUnread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}>
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                {React.cloneElement(getNotificationIcon(notification.message), { className: 'w-4 h-4' })}
            </div>
            <div className="ml-3 flex-grow">
                <p className="text-xs text-gray-700 font-medium">{notification.message}</p>
                <small className="text-[10px] text-gray-500 font-semibold">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</small>
            </div>
            {isUnread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full self-center ml-3 flex-shrink-0"></div>
            )}
        </div>
    );
};

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { notifications, unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (notification) => {
        if (!notification.is_read || notification.is_read === 'false' || notification.is_read === '0') {
            markNotificationAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllNotificationsAsRead} className="text-xs font-semibold text-blue-600 hover:underline">
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map(n => <NotificationItem key={n.id} notification={n} onNotificationClick={handleNotificationClick} />)
                        ) : (
                            <div className="p-8 text-center">
                                <FaBell className="mx-auto h-10 w-10 text-gray-300" />
                                <h4 className="mt-3 text-sm font-semibold text-gray-700">No notifications yet</h4>
                                <p className="mt-1 text-xs text-gray-500">We'll let you know when something new arrives.</p>
                            </div>
                        )}
                    </div>
                    <Link to="/notifications" onClick={onClose} className="block text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-blue-600 transition-colors">
                        View all notifications
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
