import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    subItems: [
      { name: "User Profiles", path: "/admin/user-profiles", pro: false },
      { name: "User Roles", path: "/admin/user-roles", pro: false },
      { name: "Add Client", path: "/admin/add-client", pro: false },
      { name: "Add Rider", path: "/admin/add-rider", pro: false }
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Product Management",
    subItems: [
      { name: "Product List", path: "/admin/product-list", pro: false },
      { name: "Approval Queue", path: "/admin/approval-queue", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Sales & Analytics",
    subItems: [
      { name: "Sales Overview", path: "/admin/sales-overview", pro: false },
      { name: "Client Reports", path: "/admin/client-reports", pro: false },
      { name: "Rider Earnings", path: "/admin/rider-earnings", pro: false },
      { name: "Best Sellers", path: "/admin/best-sellers", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Settings",
    subItems: [
      { name: "General Settings", path: "/admin/settings-general", pro: false },
      { name: "API & Logging", path: "/admin/settings-api", pro: false },
      { name: "Review Management", path: "/admin/settings-reviews", pro: false },
      { name: "Blacklist", path: "/admin/settings-blacklist", pro: false },
      { name: "Delivery Rates", path: "/admin/settings-delivery-rates", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "App Management",
    subItems: [
      { name: "Site Content", path: "/admin/site-content", pro: false },
      { name: "Branding", path: "/admin/branding", pro: false },
      { name: "About Us", path: "/admin/about-us", pro: false }
    ],
  },
  {
    icon: <TableIcon />,
    name: "Chat Management",
    subItems: [
      { name: "Admin Chat", path: "/admin/chat/admin", pro: false },
      { name: "Client Chat", path: "/admin/chat/client", pro: false },
      { name: "Store Chat", path: "/admin/chat/store", pro: false }
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Blank Page",
    path: "/admin/blank",
  }
];

const othersItems = [];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`group relative flex w-full items-center gap-2.5 rounded-md px-4 py-2 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${
                  nav.subItems.some((subItem) => isActive(subItem.path))
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                {nav.icon}
                <span
                  className={`duration-300 ease-in-out ${
                    !isExpanded && !isHovered && "lg:opacity-0"
                  }`}
                >
                  {nav.name}
                </span>
                <ChevronDownIcon
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transform duration-300 ease-in-out ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index &&
                    "rotate-180"
                  } ${!isExpanded && !isHovered && "lg:opacity-0"}`}
                />
              </button>
              {/* Submenu */}
              <div
                ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? subMenuHeight[`${menuType}-${index}`]
                      : 0,
                }}
              >
                <ul className="mb-5.5 mt-2 flex flex-col gap-2.5 pl-6">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                          isActive(subItem.path)
                            ? "bg-blue-100 text-primary dark:bg-gray-700"
                            : "text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        }`}
                      >
                        <span>{subItem.name}</span>
                        <span className="absolute right-4 flex items-center gap-2">
                          {subItem.new && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              NEW
                            </span>
                          )}
                          {subItem.pro && (
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              PRO
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <Link
              to={nav.path}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 ${
                isActive(nav.path) && "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {nav.icon}
              <span
                className={`duration-300 ease-in-out ${
                  !isExpanded && !isHovered && "lg:opacity-0"
                }`}
              >
                {nav.name}
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
