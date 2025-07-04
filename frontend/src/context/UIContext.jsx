import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isPageScrolled, setIsPageScrolled] = useState(false);
  const [isCategorySidebarOpen, setCategorySidebarOpen] = useState(false);

  const openCategorySidebar = () => setCategorySidebarOpen(true);
  const closeCategorySidebar = () => setCategorySidebarOpen(false);

  return (
    <UIContext.Provider 
      value={{
        isPageScrolled, 
        setIsPageScrolled,
        isCategorySidebarOpen,
        openCategorySidebar,
        closeCategorySidebar
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
