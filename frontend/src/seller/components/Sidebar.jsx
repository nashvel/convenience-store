import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaStore, FaTachometerAlt, FaBoxOpen, FaChevronDown, FaPlusCircle, FaTasks, FaClipboardList, FaComments, FaBars, FaTimes, FaStar, FaCog, FaClock, FaCalendarAlt } from 'react-icons/fa';

const Sidebar = ({ activeView, setActiveView }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isAutoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleSetActiveView = (view) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setOpenOnMobile(false);
    }
  };

  const handleToggleAutoClose = () => {
    setAutoCloseEnabled(!isAutoCloseEnabled);
    toast.info(`Store auto-close ${!isAutoCloseEnabled ? 'enabled' : 'disabled'}.`);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-open products dropdown if a product-related view is active
  useEffect(() => {
    if (['manageProducts', 'addProduct'].includes(activeView)) {
      setProductsOpen(true);
    }
  }, [activeView]);

  const menuItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    {
      id: 'products', icon: <FaBoxOpen />, label: 'Products', children: [
        { id: 'manageProducts', icon: <FaTasks />, label: 'Manage' },
        { id: 'addProduct', icon: <FaPlusCircle />, label: 'Add New' },
      ]
    },
    { id: 'orders', icon: <FaClipboardList />, label: 'Orders' },
    { id: 'reviews', icon: <FaStar />, label: 'Reviews' },
    { id: 'chat', icon: <FaComments />, label: 'Chat' },
    { id: 'manageStore', icon: <FaCog />, label: 'Manage Store' },
  ];

  const MenuButton = ({ item, onClick, isCollapsed, isActive, hasChildren }) => {
    const baseClasses = 'flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-primary text-white';
    const inactiveClasses = 'text-gray-600 hover:bg-primary-light hover:text-primary';

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
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpenOnMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpenOnMobile(false)}
      ></div>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setOpenOnMobile(!isOpenOnMobile)} 
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white text-gray-800 shadow-lg"
      >
        {isOpenOnMobile ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed md:relative flex flex-col bg-white shadow-lg z-40 h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setCollapsed(!isCollapsed)} 
          className="hidden md:flex items-center justify-center absolute -right-4 top-8 h-8 w-8 rounded-full bg-primary text-white shadow-md hover:bg-primary-dark transition-colors"
        >
          {isCollapsed ? <FaBars size={14}/> : <FaTimes size={14} />}
        </button>

        {/* Logo */}
        <div className={`flex items-center h-20 px-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : ''}`}>
          <FaStore className="text-primary text-3xl flex-shrink-0" />
          <span className={`ml-3 text-xl font-bold text-gray-800 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <div key={item.id}>
              <MenuButton 
                item={item} 
                onClick={() => item.children ? setProductsOpen(!isProductsOpen) : handleSetActiveView(item.id)}
                isCollapsed={isCollapsed} 
                isActive={activeView === item.id || (item.children && item.children.some(child => child.id === activeView))}
                hasChildren={!!item.children}
              />
              {item.children && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && isProductsOpen ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                  <div className="pl-8 space-y-2 border-l border-gray-200 ml-4">
                    {item.children.map(child => (
                      <MenuButton 
                        key={child.id} 
                        item={child} 
                        onClick={() => handleSetActiveView(child.id)}
                        isCollapsed={isCollapsed} 
                        isActive={activeView === child.id} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-40 mb-4'}`}>
            <div className="flex items-center justify-around text-center p-2 rounded-lg bg-gray-50">
              <div>
                <div className="text-xs font-bold text-primary">{currentTime.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</div>
                <div className="text-2xl font-bold text-gray-800">{currentTime.getDate()}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                <div className="text-xs text-gray-500">{currentTime.toLocaleDateString(undefined, { weekday: 'long' })}</div>
              </div>
            </div>
          </div>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <span className={`text-gray-600 text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Auto-Close</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isAutoCloseEnabled} onChange={handleToggleAutoClose} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-light peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
