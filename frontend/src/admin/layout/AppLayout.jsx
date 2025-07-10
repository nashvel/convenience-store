import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
        isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"
      } ${isMobileOpen ? "w-full" : "w-0"}`}>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
