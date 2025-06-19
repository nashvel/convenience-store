import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaHome, FaStore, FaUser, FaBars, FaTimes, FaBuilding, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import eventEmitter from '../utils/event-emitter';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useContext(CartContext);
  const [notificationCount, setNotificationCount] = useState(0);

  const dashboardPath = user ? {
    'admin': '/admin/dashboard',
    'client': '/seller/dashboard',
    'rider': '/rider/dashboard'
  }[user.role] : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:8080/api/notifications?userId=${user.id}`);
          if (response.data.success) {
            const unreadCount = response.data.notifications.filter(n => !n.is_read).length;
            setNotificationCount(unreadCount);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };

    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      eventEmitter.subscribe('newNotification', fetchNotifications);

      return () => {
        clearInterval(interval);
        eventEmitter.unsubscribe('newNotification', fetchNotifications);
      };
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const NavLink = ({ to, icon, children, exact = false }) => {
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`
          relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
          ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
          after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 
          after:transition-transform after:duration-300 after:ease-out after:origin-left 
          ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} 
          hover:after:scale-x-100
        `}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  const renderNavLinks = () => (
    <>
      <NavLink to="/" icon={<FaHome />} exact={true}>Home</NavLink>
      <NavLink to="/products" icon={<FaStore />}>Products</NavLink>
      <NavLink to="/stores" icon={<FaBuilding />}>Stores</NavLink>
    </>
  );

  const Dropdown = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {trigger}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"
            >
              <div className="py-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const DropdownItem = ({ to, onClick, children }) => {
    const classes = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
    return to ? <Link to={to} className={classes}>{children}</Link> : <button onClick={onClick} className={classes}>{children}</button>;
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-20 ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">Nash<span className="text-gray-800">QuickMart</span></h1>
          </Link>

          <div className="hidden md:flex items-center space-x-2 h-full">
            {renderNavLinks()}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSearchOpen(!searchOpen)} className="text-gray-700 hover:text-blue-600">
              <FaSearch size={20} />
            </motion.button>

            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">{totalItems}</span>
              )}
            </Link>

            {user && (
              <Link to="/notifications" className="relative text-gray-700 hover:text-blue-600">
                <FaBell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">{notificationCount}</span>
                )}
              </Link>
            )}

            {user ? (
              <Dropdown trigger={<button className="flex items-center gap-1.5 text-gray-700"><FaUser size={20} /></button>}>
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {dashboardPath && <DropdownItem to={dashboardPath}>Manage</DropdownItem>}
                <DropdownItem to="/profile/settings">Settings</DropdownItem>
                <div className="border-t border-gray-200 my-1"></div>
                <DropdownItem onClick={logout}>Sign Out</DropdownItem>
              </Dropdown>
            ) : (
              <Dropdown trigger={<button className="flex items-center gap-1.5 text-gray-700"><FaUser size={20} /></button>}>
                <DropdownItem to="/signin">Sign In</DropdownItem>
                <DropdownItem to="/signup">Sign Up</DropdownItem>
              </Dropdown>
            )}

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-blue-600">
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-full left-0 right-0 bg-white shadow-md">
            <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto p-4 flex">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"/>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"><FaSearch /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {renderNavLinks()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;