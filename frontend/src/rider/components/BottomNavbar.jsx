import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaHistory, FaUserCircle } from 'react-icons/fa';

const BottomNavbar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
      isActive
        ? 'text-blue-500 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center md:hidden z-50">
      <NavLink to="/rider" end className={navLinkClasses}>
        <FaTachometerAlt className="w-6 h-6 mb-1" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/rider/active-orders" className={navLinkClasses}>
        <FaBoxOpen className="w-6 h-6 mb-1" />
        <span>Active</span>
      </NavLink>
      <NavLink to="/rider/order-history" className={navLinkClasses}>
        <FaHistory className="w-6 h-6 mb-1" />
        <span>History</span>
      </NavLink>
      <NavLink to="/rider/profile" className={navLinkClasses}>
        <FaUserCircle className="w-6 h-6 mb-1" />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomNavbar;
