import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaStore, FaTachometerAlt, FaBoxOpen, FaChevronDown, FaUsers,
  FaChartLine, FaCog, FaMobileAlt, FaComments, FaFile, FaBars, FaTimes
} from 'react-icons/fa';
import { useSidebar } from '../context/SidebarContext';

const navItems = [
  { icon: <FaTachometerAlt />, name: "Dashboard", path: "/admin" },
  {
    icon: <FaUsers />,
    name: "User Management",
    subItems: [
      { name: "User Roles", path: "/admin/user-roles" },
      { name: "Clients", path: "/admin/clients" },
      { name: "Customers", path: "/admin/customers" },
      { name: "Riders", path: "/admin/riders" }
    ],
  },
  {
    icon: <FaBoxOpen />,
    name: "Product Management",
    subItems: [
      { name: "Product List", path: "/admin/product-list" },
      { name: "Approval Queue", path: "/admin/approval-queue" },
    ],
  },
  {
    icon: <FaChartLine />,
    name: "Sales & Analytics",
    subItems: [
      { name: "Sales Overview", path: "/admin/sales-overview" },
      { name: "Client Reports", path: "/admin/client-reports" },
      { name: "Rider Earnings", path: "/admin/rider-earnings" },
      { name: "Best Sellers", path: "/admin/best-sellers" },
    ],
  },
  {
    icon: <FaCog />,
    name: "Settings",
    path: "/admin/settings-general",
  },
  {
    icon: <FaMobileAlt />,
    name: "App Management",
    subItems: [
      { name: "Home", path: "/admin/app-home" },
      { name: "App", path: "/admin/app-preview" },
      { name: "Support", path: "/admin/app-support" },
      { name: "Manage Promotions", path: "/admin/manage-promotions" },
      { name: "Site Settings", path: "/admin/site-settings" }
    ],
  },
  {
    icon: <FaComments />,
    name: "Chat Management",
    subItems: [
      { name: "Admin Chat", path: "/admin/chat/admin" },
      { name: "Client Chat", path: "/admin/chat/client" },
      { name: "Store Chat", path: "/admin/chat/store" }
    ],
  },
  {
    icon: <FaFile />,
    name: "Blank Page",
    path: "/admin/blank",
  }
];

const AppSidebar = () => {
  const { isExpanded, toggleSidebar, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeSubmenu = navItems.find(item => 
      item.subItems && item.subItems.some(child => location.pathname.startsWith(child.path))
    );
    if (activeSubmenu) {
      setOpenSubmenus(prev => ({ ...prev, [activeSubmenu.name]: true }));
    }
  }, [location.pathname]);

  const handleSubmenuToggle = (name) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const MenuLink = ({ item }) => {
    const baseClasses = 'flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-blue-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-blue-600 hover:text-white';
    const isCollapsed = !isExpanded;

    return (
      <NavLink
        to={item.path}
        end={!item.subItems}
        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
        onClick={() => {
          if (window.innerWidth < 768) {
            toggleMobileSidebar();
          }
        }}
      >
        <span className="flex-shrink-0 text-lg">{item.icon}</span>
        <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
      </NavLink>
    );
  };

  const MenuButton = ({ item, onClick, isCollapsed, isActive, hasChildren, isOpen }) => {
    const baseClasses = 'flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200';
    const activeClasses = 'bg-blue-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-blue-600 hover:text-white';

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'justify-center' : ''}`}
      >
        <span className="flex-shrink-0 text-lg">{item.icon}</span>
        <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
        {hasChildren && !isCollapsed && <FaChevronDown className={`ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
    );
  };

  const isCollapsed = !isExpanded;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMobileSidebar}
      ></div>
       <button 
        onClick={toggleMobileSidebar} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white text-gray-800 shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <aside className={`fixed md:relative flex flex-col bg-blue-800 shadow-lg z-40 h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div 
          className={`flex items-center h-20 px-4 border-b border-blue-900 cursor-pointer flex-shrink-0 ${isCollapsed ? 'justify-center' : ''}`}
          onClick={toggleSidebar}
        >
          <FaStore className="text-white text-3xl flex-shrink-0" />
          <span className={`ml-3 text-xl font-bold text-white whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Admin Panel</span>
        </div>

        {/* Navigation Menu with Scrolling */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <MenuButton 
                      item={item} 
                      onClick={() => handleSubmenuToggle(item.name)}
                      isCollapsed={isCollapsed} 
                      isActive={item.subItems.some(child => location.pathname.startsWith(child.path))}
                      hasChildren={!!item.subItems}
                      isOpen={openSubmenus[item.name]}
                    />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && openSubmenus[item.name] ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                      <div className="pl-8 space-y-2 border-l border-blue-700 ml-4">
                        {item.subItems.map(child => (
                          <MenuLink key={child.path} item={{...child, icon: ''}} />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <MenuLink item={item} />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Clock */}
        <div className="flex-shrink-0 p-4 border-t border-blue-900">
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
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
