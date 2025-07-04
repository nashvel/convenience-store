import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2"
      >
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {user && user.first_name && user.last_name ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : 'A'}
        </div>
        <div className="hidden sm:block text-left">
            <span className="block font-medium text-gray-800 dark:text-white text-sm">{user ? `${user.first_name} ${user.last_name}` : 'User'}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Administrator'}</span>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="block font-semibold text-gray-800 dark:text-white text-sm">
              {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {user ? user.email : 'admin@example.com'}
            </span>
          </div>

          <ul className="flex flex-col p-2">
            <li>
              <Link
                to="/admin/user-profiles"
                onClick={closeDropdown}
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-md group text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>My Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-md group text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FiLogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
