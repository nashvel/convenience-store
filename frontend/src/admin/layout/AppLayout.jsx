import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="flex h-full">
          <div className={`transition-all duration-300 ease-in-out ${
            isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"
          } ${isMobileOpen ? "w-full" : "w-0"}`}>
            <AppSidebar />
            <Backdrop />
          </div>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-(--breakpoint-2xl) md:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>  
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
