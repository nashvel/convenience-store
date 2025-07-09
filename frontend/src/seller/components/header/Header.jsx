import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBoxes, FaClipboardList, FaPlus } from 'react-icons/fa';

const Header = ({ setActiveView }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = (e) => {
    e.preventDefault();
    // In a real app, you would clear auth tokens here
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const QuickAccessButton = ({ icon, label, onClick }) => (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-primary-light hover:text-primary text-gray-600 font-semibold text-sm transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const IconButton = ({ icon, badge, onClick = () => {} }) => (
    <button onClick={onClick} className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary transition-colors duration-200">
      {icon}
      {badge && <span className="absolute top-0 right-0 block w-4 h-4 text-xs font-bold text-white bg-primary rounded-full transform translate-x-1/4 -translate-y-1/4">{badge}</span>}
    </button>
  );

  const DropdownItem = ({ icon, label, onClick }) => (
    <a href="#" onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors">
      {icon}
      <span>{label}</span>
    </a>
  );

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 h-24">
      {/* Search Bar */}
      <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors"
        />
      </div>

      {/* Quick Access */}
      <div className="hidden md:flex items-center gap-3">
        <QuickAccessButton icon={<FaBoxes />} label="Stocks" onClick={() => setActiveView('manageProducts')} />
        <QuickAccessButton icon={<FaClipboardList />} label="Orders" onClick={() => setActiveView('orders')} />
        <QuickAccessButton icon={<FaPlus />} label="Add Product" onClick={() => setActiveView('addProduct')} />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <IconButton icon={<FaBell size={20} />} badge="3" />
        <div className="relative" ref={dropdownRef}>
          <IconButton icon={<FaUserCircle size={24} />} onClick={() => setDropdownOpen(!isDropdownOpen)} />
          <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="p-2">
              <DropdownItem icon={<FaUserCircle />} label="Profile" />
              <DropdownItem icon={<FaCog />} label="Settings" />
              <div className="my-1 border-t border-gray-100"></div>
              <DropdownItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
