import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isPageScrolled, setIsPageScrolled] = useState(false);
  const [isCategorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [isMessageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  const openCategorySidebar = () => setCategorySidebarOpen(true);
  const closeCategorySidebar = () => setCategorySidebarOpen(false);

  const openMessageDropdown = (recipient = null) => {
    setChatRecipient(recipient);
    setMessageDropdownOpen(true);
  };

  const closeMessageDropdown = () => {
    setMessageDropdownOpen(false);
    setChatRecipient(null); // Clear recipient when closing
  };

  return (
    <UIContext.Provider 
      value={{
        isPageScrolled, 
        setIsPageScrolled,
        isCategorySidebarOpen,
        openCategorySidebar,
        closeCategorySidebar,
        isMessageDropdownOpen,
        openMessageDropdown,
        closeMessageDropdown,
        chatRecipient
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
