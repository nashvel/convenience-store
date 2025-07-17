import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsersCog, FaUserTie, FaUserFriends, FaMotorcycle } from 'react-icons/fa';

const links = [
  { name: 'User Roles', path: '/admin/user-roles', icon: <FaUsersCog className="mr-2" /> },
  { name: 'Clients', path: '/admin/clients', icon: <FaUserTie className="mr-2" /> },
  { name: 'Customers', path: '/admin/customers', icon: <FaUserFriends className="mr-2" /> },
  { name: 'Riders', path: '/admin/riders', icon: <FaMotorcycle className="mr-2" /> },
];

const UserManagementQuickLinks = () => {
  const location = useLocation();

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-6">
        {links.map(link => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserManagementQuickLinks;
