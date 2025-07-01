import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaHome, FaStore, FaUser, FaBars, FaTimes, FaBuilding, FaBell, FaChevronDown, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { UIContext } from '../context/UIContext';
import { StoreContext } from '../context/StoreContext';
import eventEmitter from '../utils/event-emitter';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems: cartCount } = useContext(CartContext);
  const { unreadCount } = useNotifications();
  const { categories, priceRange, handlePriceChange } = useContext(StoreContext);
  const { isPageScrolled } = useContext(UIContext);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/public-settings`);
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch public settings for Navbar:', error);
      }
    };

    fetchSettings();
  }, []);
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = queryParams.get('category');

  const renderAppName = (name) => {
    const appName = name || 'NashQuickMart';
    let part1 = appName;
    let part2 = '';

    // Try to split by the first uppercase letter after the start
    let splitIndex = -1;
    for (let i = 1; i < appName.length; i++) {
      if (appName[i] >= 'A' && appName[i] <= 'Z') {
        splitIndex = i;
        break;
      }
    }

    if (splitIndex !== -1) {
      part1 = appName.substring(0, splitIndex);
      part2 = appName.substring(splitIndex);
    } else {
      // If no uppercase, try to split by the first space
      const spaceIndex = appName.indexOf(' ');
      if (spaceIndex !== -1) {
        part1 = appName.substring(0, spaceIndex);
        part2 = appName.substring(spaceIndex + 1);
      } else {
        // As a last resort, split near the middle
        const mid = Math.ceil(appName.length / 2);
        part1 = appName.substring(0, mid);
        part2 = appName.substring(mid);
      }
    }

    return (
      <span className="text-2xl font-bold text-gray-900">
        {part1}
        <span className="text-blue-600">{part2}</span>
      </span>
    );
  };

  const dashboardPath = user ? {
    'admin': '/admin',
    'client': '/seller/dashboard',
    'rider': '/rider/dashboard'
  }[user.role] : null;

  

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/stores') {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
      <NavLink to="/restaurants" icon={<FaShoppingBag />}>Restaurants</NavLink>
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm transition-all duration-300`}
      animate={{
        height: (location.pathname === '/stores' && isPageScrolled) ? 64 : 80,
        boxShadow: isScrolled || (location.pathname === '/stores' && isPageScrolled) ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
      transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            {renderAppName(settings.app_name)}
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {renderNavLinks()}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSearchOpen(!searchOpen)} className="text-gray-700 hover:text-blue-600">
              <FaSearch size={20} />
            </motion.button>

            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">{cartCount}</span>
              )}
            </Link>

                        <Link to="/notifications" className="relative text-gray-600 hover:text-primary transition-colors">
              <FaBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Link>

            {user ? (
              <Dropdown trigger={<button className="flex items-center gap-1.5 text-gray-700"><FaUser size={20} /></button>}>
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {dashboardPath && <DropdownItem to={dashboardPath}>Manage</DropdownItem>}
                <DropdownItem to="/my-orders">My Orders</DropdownItem>
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

      {/* Categories Bar */}
      <AnimatePresence>
        {location.pathname.startsWith('/products') && (
          <motion.div
            className="bg-white border-t border-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 py-3 overflow-x-auto">
                <Link to="/products" className={`text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full transition-colors ${!categoryParam ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  All Categories
                </Link>
                {categories && categories.map(cat => {
                  const isActive = categoryParam === cat.name;
                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      className={`text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}

                <div className="border-l border-gray-200 h-6 mx-2"></div>

                <Dropdown
                  trigger={
                    <button className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full transition-colors text-gray-600 hover:bg-gray-100">
                      <span>Price</span>
                      <FaChevronDown className="h-3 w-3" />
                    </button>
                  }
                >
                  <div className="p-2 w-56">
                    <p className="text-sm font-semibold text-gray-700 mb-2 px-2">Price Range</p>
                    <div className="flex items-center space-x-2 px-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        placeholder="Min"
                        className="w-full p-1 border rounded-md text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        placeholder="Max"
                        className="w-full p-1 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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