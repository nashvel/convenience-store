import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHeart, FaUser, FaShoppingCart, FaTh, FaBell, FaEnvelope } from 'react-icons/fa';
import { UIContext } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import MessageDropdown from './MessageDropdown';
import NotificationDropdown from './NotificationDropdown';
import { useNotifications } from '../context/NotificationContext';



const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);
  const { openCategorySidebar } = useContext(UIContext);
  const { user } = useAuth();
  const { totalItems: cartCount } = useContext(CartContext);
  const { unreadCount: unreadNotifications } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const NavLink = ({ to, children, exact = false }) => {
    const location = useLocation();
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`
          relative px-3 py-2 font-medium transition-colors
          ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary
          after:transition-transform after:duration-300 after:ease-out after:origin-left
          ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
          hover:after:scale-x-100
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <motion.header 
      className="bg-white sticky top-0 z-30"
      animate={{
        boxShadow: isScrolled 
          ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
          : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Left Side: Mobile Toggle & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={openCategorySidebar}
              className="lg:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Open category menu"
            >
              <FaTh size={20} />
            </button>
            <Link to="/" className="text-2xl font-bold text-primary">EcomXpert</Link>
          </div>

          {/* Center Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" exact={true}>Home</NavLink>
            <NavLink to="/products">All Products</NavLink>
            <NavLink to="/stores">Stores</NavLink>
            <NavLink to="/promotions">Promotions</NavLink>
            {user && <NavLink to="/my-orders">My Orders</NavLink>}
          </div>

          {/* Right Side: Search & Icons */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block w-full max-w-xs">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-primary"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {user && (
                <>
                  <div className="relative" ref={notificationsRef}>
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-primary hover:bg-blue-50" aria-label="View notifications">
                      <FaBell size={22} />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">{unreadNotifications}</span>
                      )}
                    </button>
                    <NotificationDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                  </div>
                  <div className="relative" ref={messagesRef}>
                    <button onClick={() => setIsMessagesOpen(!isMessagesOpen)} className="relative p-2 rounded-full text-primary hover:bg-blue-50" aria-label="View messages">
                      <FaEnvelope size={22} />
                    </button>
                    {isMessagesOpen && <MessageDropdown />}
                  </div>
                </>
              )}
              <Link to="/wishlist" className="p-2 rounded-full text-primary hover:bg-blue-50" aria-label="View your wishlist">
                <FaHeart size={22} />
              </Link>
              <Link to={user ? "/profile/settings" : "/login"} className="p-2 rounded-full text-primary hover:bg-blue-50" aria-label={user ? "View your profile" : "Sign in"}>
                <FaUser size={22} />
              </Link>
              <Link to="/cart" className="relative p-2 rounded-full text-primary hover:bg-blue-50" aria-label="View your shopping cart">
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden py-2 border-t">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search for items..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-primary"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;