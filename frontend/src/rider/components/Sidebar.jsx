import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaHistory, FaUserCircle, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
    const navLinkClasses = ({ isActive }) =>
    `flex items-center p-3 text-base font-normal rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`;

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rider Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/rider" end className={navLinkClasses}>
            <FaTachometerAlt className="w-6 h-6" />
            <span className="ml-3">Dashboard</span>
          </NavLink>
          <NavLink to="/rider/active-orders" className={navLinkClasses}>
            <FaBoxOpen className="w-6 h-6" />
            <span className="ml-3">Active Orders</span>
          </NavLink>
          <NavLink to="/rider/order-history" className={navLinkClasses}>
            <FaHistory className="w-6 h-6" />
            <span className="ml-3">Order History</span>
          </NavLink>
          <NavLink to="/rider/profile" className={navLinkClasses}>
            <FaUserCircle className="w-6 h-6" />
            <span className="ml-3">Profile</span>
          </NavLink>
      </nav>
    </div>
      );
};

export default Sidebar;
