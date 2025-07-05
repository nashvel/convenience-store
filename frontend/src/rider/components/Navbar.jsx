import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle, FaSun, FaMoon, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const Navbar = ({ notificationCount, onClearNotifications, availableOrders }) => {
  const { theme, toggleTheme } = useTheme();
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!isNotificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const handleLogout = () => {
    // Implement actual logout logic here
    alert('Logged out successfully!');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Rider Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun className="text-yellow-400" size={22} />}
            </button>
            <div className="relative">
              <button 
                onClick={toggleNotificationDropdown} 
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                <FaBell size={22} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div ref={notificationDropdownRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {availableOrders.slice(0, notificationCount).map(order => (
                      <div key={order.id} className="p-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-white">New Order: {order.storeName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Deliver to: {order.deliveryAddress}</p>
                      </div>
                    ))}
                    {notificationCount === 0 && (
                        <p className="p-4 text-center text-gray-500 dark:text-gray-400">No new notifications</p>
                    )}
                  </div>
                  {notificationCount > 0 && (
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={() => { onClearNotifications(); setNotificationDropdownOpen(false); }} className="w-full text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={toggleProfileDropdown} className="p-1 rounded-full text-gray-600 dark:text-gray-300 focus:outline-none">
                <FaUserCircle size={28} />
              </button>
              {isProfileDropdownOpen && (
                <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <Link to="/rider/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaEdit className="mr-3" />
                      Edit Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
