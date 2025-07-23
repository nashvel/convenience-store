import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHeart, FaUser, FaShoppingCart, FaTh, FaBell, FaEnvelope, FaStore, FaChevronDown, FaShoppingBag, FaUtensils } from 'react-icons/fa';
import { UIContext } from '../../context/UIContext';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import MessageDropdown from '../Dropdowns/MessageDropdown';
import NotificationDropdown from '../Dropdowns/NotificationDropdown';
import { useNotifications } from '../../context/NotificationContext';
import { getChats } from '../../api/chatApi';
import api from '../../api/axios-config';
import Fuse from 'fuse.js';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [fuse, setFuse] = useState(null);

  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);

  const { openCategorySidebar, isMessageDropdownOpen, openMessageDropdown, closeMessageDropdown, chatRecipient } = useContext(UIContext);
  const { openChat } = useChat();
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();
  const appName = settings?.app_name || 'EcomXpert';
  const { totalItems: cartCount } = useContext(CartContext);
  const { categories, stores: contextStores } = useContext(StoreContext);

  const { unreadCount: unreadNotifications } = useNotifications();

  // Initialize Fuse.js for enhanced search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          api.get('/products'),
          api.get('/stores')
        ]);
        
        const productsData = productsRes.data?.data || [];
        const storesData = storesRes.data?.data || contextStores || [];
        
        setProducts(productsData);
        setStores(storesData);
        
        // Configure Fuse.js
        const fuseOptions = {
          keys: [
            { name: 'name', weight: 0.7 },
            { name: 'description', weight: 0.3 },
            { name: 'category', weight: 0.5 },
            { name: 'store_name', weight: 0.4 }
          ],
          threshold: 0.3,
          includeScore: true,
          minMatchCharLength: 2
        };
        
        // Combine products and stores for search
        const searchData = [
          ...productsData.map(p => ({ ...p, type: 'product' })),
          ...storesData.map(s => ({ ...s, type: 'store' }))
        ];
        
        setFuse(new Fuse(searchData, fuseOptions));
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      }
    };
    
    fetchData();
  }, [contextStores]);

  useEffect(() => {
    if (user) {
      const fetchAndSetChats = async () => {
        try {
          const fetchedChats = await getChats();
          setChats(fetchedChats);
        } catch (error) {
          console.error("Failed to fetch chats for navbar", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAndSetChats();
    } else {
      // Clear chat data when user logs out
      setChats([]);
      setLoading(true);
    }
  }, [user]);

  useEffect(() => {
    if (chatRecipient) {
      openChat(chatRecipient);
    }
  }, [chatRecipient, openChat]);

  const totalUnreadCount = chats.reduce((acc, chat) => acc + (chat.unread_count || 0), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close message dropdown when user logs out
  useEffect(() => {
    if (!user) {
      closeMessageDropdown();
      setIsNotificationsOpen(false);
    }
  }, [user, closeMessageDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        closeMessageDropdown();
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

  // Enhanced search with Fuse.js
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() && fuse) {
      const results = fuse.search(query.trim()).slice(0, 8);
      setSearchResults(results);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (result) => {
    if (result.item.type === 'product') {
      navigate(`/product/${result.item.id}`);
    } else if (result.item.type === 'store') {
      navigate(`/stores/${result.item.id}`);
    }
    setShowSearchDropdown(false);
    setSearchQuery('');
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
      className="bg-white shadow-sm sticky top-0 w-full z-50 relative"
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
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-10" />
              ) : (
                <span className="text-2xl font-bold text-primary">{appName}</span>
              )}
            </Link>
            <button 
              onClick={openCategorySidebar}
              className="lg:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Open category menu"
            >
              <FaTh size={20} />
            </button>

          </div>

          {/* Center Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" exact={true}>Home</NavLink>
            <NavLink to="/products">Shop</NavLink>
            <NavLink to="/restaurants">Restaurants</NavLink>
            <NavLink to="/promotions">Promotions</NavLink>
            {user && <NavLink to="/my-orders">My Orders</NavLink>}
          </div>

          {/* Right Side: Search & Icons */}
          <div className="flex items-center gap-4">
            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden lg:block w-full max-w-xs relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Search products, stores..."
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </form>
              
              {/* Enhanced Search Dropdown */}
              <AnimatePresence>
                {showSearchDropdown && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Search Results</h3>
                        <button
                          onClick={() => setShowSearchDropdown(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <button
                            key={`${result.item.type}-${result.item.id}-${index}`}
                            onClick={() => handleSearchResultClick(result)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              result.item.type === 'product' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {result.item.type === 'product' ? (
                                <span className="text-xs font-bold">{result.item.name?.charAt(0) || 'P'}</span>
                              ) : (
                                <FaStore className="text-xs" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {result.item.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {result.item.type === 'product' ? (
                                  `${result.item.store_name || 'Product'} • ${result.item.category || 'General'}`
                                ) : (
                                  `Store • ${result.item.category || 'General'}`
                                )}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {result.item.type}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {searchQuery && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full flex items-center justify-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaSearch className="text-xs" />
                            <span>View all results for "{searchQuery}"</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  {user.role === 'customer' && (
                    <div className="relative" ref={messagesRef}>
                      <button onClick={isMessageDropdownOpen ? closeMessageDropdown : openMessageDropdown} className="relative p-2 rounded-full text-primary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
                        <FaEnvelope size={22} />
                        {totalUnreadCount > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalUnreadCount}
                          </span>
                        )}
                      </button>
                      <AnimatePresence>
                        {isMessageDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-80 origin-top-right"
                          >
                            <MessageDropdown closeDropdown={closeMessageDropdown} chats={chats} loading={loading} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
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

        {/* Enhanced Search Bar - Mobile */}
        <div className="lg:hidden py-2 border-t relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search products, stores..."
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
          
          {/* Mobile Search Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto mx-4"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">Search Results</h3>
                    <button
                      onClick={() => setShowSearchDropdown(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {searchResults.slice(0, 5).map((result, index) => (
                      <button
                        key={`mobile-${result.item.type}-${result.item.id}-${index}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          result.item.type === 'product' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {result.item.type === 'product' ? (
                            <span className="text-xs font-bold">{result.item.name?.charAt(0) || 'P'}</span>
                          ) : (
                            <FaStore className="text-xs" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.item.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.item.type === 'product' ? (
                              `${result.item.store_name || 'Product'} • ${result.item.category || 'General'}`
                            ) : (
                              `Store • ${result.item.category || 'General'}`
                            )}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {searchQuery && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaSearch className="text-xs" />
                        <span>View all results</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;