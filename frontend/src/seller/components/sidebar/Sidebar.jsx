import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStore, FaTachometerAlt, FaBoxOpen, FaChevronDown, FaPlusCircle, FaTasks, FaClipboardList, FaComments, FaBars, FaTimes, FaStar, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../api/axios-config';
import { useTutorial } from '../../context/TutorialContext';

const Sidebar = ({ isCollapsed, setCollapsed }) => {
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isAutoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const location = useLocation();
  const { startTutorial } = useTutorial();

  const handleToggleAutoClose = async () => {
    const newStatus = !isAutoCloseEnabled;
    setAutoCloseEnabled(newStatus); // Optimistic update

    try {
      await api.post('/seller/store/toggle-status', { is_active: newStatus });
      toast.success(`Store is now ${newStatus ? 'open' : 'closed'}.`);
    } catch (error) {
      console.error('Failed to update store status:', error);
      toast.error('Failed to update store status.');
      setAutoCloseEnabled(!newStatus); // Revert on failure
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setProductsOpen(location.pathname.startsWith('/seller/products'));
  }, [location.pathname]);

  useEffect(() => {
    const checkStoreProfile = async () => {
      try {
        console.log('Fetching store data...');
        const response = await api.get('/seller/store');
        const store = response.data;
        console.log('Store data received:', store);
        console.log('Store is_active value:', store.is_active);
        
        const isActive = store.is_active === 1 || store.is_active === '1' || store.is_active === true;
        setAutoCloseEnabled(isActive);
        setIsLoadingStatus(false);
        console.log('Toggle state set to:', isActive);

        const fields = [];
        if (!store.name) fields.push('store name');
        if (!store.address) fields.push('address');
        if (!store.closing_time) fields.push('closing time');

        if (fields.length > 0) {
          setIsProfileIncomplete(true);
          setMissingFields(fields);
        } else {
          setIsProfileIncomplete(false);
          setMissingFields([]);
        }
      } catch (error) {
        // It's okay if this fails, we just won't show the notice.
        console.error('Could not check store profile status:', error);
        setIsLoadingStatus(false);
        console.log('Failed to fetch store data, loading state set to false');
      }
    };

    checkStoreProfile();
  }, [location.pathname]);

  const menuItems = [
    { path: '/seller/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/seller/products/manage', icon: <FaTasks />, label: 'Manage Products' },
    { path: '/seller/orders', icon: <FaClipboardList />, label: 'Orders' },
    { path: '/seller/reviews', icon: <FaStar />, label: 'Reviews' },
    { path: '/seller/chat', icon: <FaComments />, label: 'Chat' },
    { path: '/seller/manage-store', icon: <FaCog />, label: 'Manage Store' },
  ];

  const MenuLink = ({ item }) => {
    const baseClasses = 'flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-blue-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-blue-600 hover:text-white';

    return (
      <NavLink
        to={item.path}
        end={!item.children}
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
        onClick={() => {
          if (window.innerWidth < 768) {
            setOpenOnMobile(false);
          }
        }}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
      </NavLink>
    );
  };

  const MenuButton = ({ item, onClick, isCollapsed, isActive, hasChildren }) => {
    const baseClasses = 'flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-blue-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-blue-600 hover:text-white';

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
        {hasChildren && !isCollapsed && <FaChevronDown className={`ml-auto transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />}
      </button>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpenOnMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpenOnMobile(false)}
      ></div>
      <button 
        onClick={() => setOpenOnMobile(!isOpenOnMobile)} 
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white text-gray-800 shadow-lg"
      >
        {isOpenOnMobile ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <aside className={`fixed flex flex-col bg-blue-800 shadow-lg z-40 h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div 
          className={`flex items-center h-20 px-4 border-b border-blue-900 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => setCollapsed(!isCollapsed)}
        >
          <FaStore className="text-white text-3xl flex-shrink-0" />
          <span className={`ml-3 text-xl font-bold text-white whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Admin Panel</span>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <div key={item.id || item.path}>
              {item.children ? (
                <MenuButton 
                  item={item} 
                  onClick={() => setProductsOpen(!isProductsOpen)}
                  isCollapsed={isCollapsed} 
                  isActive={location.pathname.startsWith('/seller/products')}
                  hasChildren={!!item.children}
                />
              ) : (
                <MenuLink item={item} />
              )}
              {item.children && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && isProductsOpen ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                  <div className="pl-8 space-y-2 border-l border-blue-700 ml-4">
                    {item.children.map(child => (
                      <MenuLink key={child.path} item={child} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {!isCollapsed && isProfileIncomplete && (
            <Link to="/seller/manage-store" onClick={startTutorial} className="mt-4 mx-2 block p-3 rounded-lg bg-yellow-100 text-yellow-900 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700 transition-colors">
              <div className="flex items-start">
                <FaExclamationTriangle className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Store Incomplete</p>
                  <p className="text-xs">Please add: {missingFields.join(', ')}.</p>
                </div>
              </div>
            </Link>
          )}
        </nav>
        <div className="mt-auto p-4 border-t border-blue-900">
          <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-40 mb-4'}`}>
            <div className="flex items-center justify-around text-center p-2 rounded-lg bg-blue-700">
              <div>
                <div className="text-xs font-bold text-blue-300">{currentTime.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</div>
                <div className="text-2xl font-bold text-white">{currentTime.getDate()}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                <div className="text-xs text-blue-300">{currentTime.toLocaleDateString(undefined, { weekday: 'long' })}</div>
              </div>
            </div>
          </div>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <span className={`text-gray-300 text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Auto-Close</span>
            <label className={`relative inline-flex items-center ${isLoadingStatus ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isAutoCloseEnabled} 
                onChange={handleToggleAutoClose} 
                disabled={isLoadingStatus}
              />
              <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;