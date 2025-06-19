import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  return (
    <UIContext.Provider value={{ isPageScrolled, setIsPageScrolled }}>
      {children}
    </UIContext.Provider>
  );
};
