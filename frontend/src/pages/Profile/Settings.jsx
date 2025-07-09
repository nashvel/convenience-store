import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserEdit, FaShieldAlt, FaTrashAlt } from 'react-icons/fa';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import SecuritySettings from '../../components/Profile/SecuritySettings';
import DeleteAccount from '../../components/Profile/DeleteAccount';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = user ? {
    'admin': '/admin/dashboard',
    'client': '/seller/dashboard',
    'rider': '/rider/dashboard'
  }[user.role] : null;

  const navItems = [
    { id: 'profile', label: 'Edit Profile', icon: FaUserEdit },
    { id: 'security', label: 'Account Security', icon: FaShieldAlt },
    { id: 'delete', label: 'Delete Account', icon: FaTrashAlt },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'delete':
        return <DeleteAccount />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="mt-2 text-lg text-gray-500">Manage your profile, password, and account settings.</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {dashboardPath && (
              <Link 
                to={dashboardPath} 
                className="px-4 py-2 text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors no-underline"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-md font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
