import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [openChats, setOpenChats] = useState([]);

  const openChat = (chat) => {
    setOpenChats(prevChats => {
      if (prevChats.find(c => c.id === chat.id)) {
        return prevChats; // Already open
      }
      // Limit to 3 open chats, remove the oldest if full
      const newChats = [...prevChats, chat];
      if (newChats.length > 3) {
        newChats.shift();
      }
      return newChats;
    });
  };

  const closeChat = (chatId) => {
    setOpenChats(prevChats => prevChats.filter(c => c.id !== chatId));
  };

  const toggleMinimizeChat = (chatId) => {
    setOpenChats(prevChats =>
      prevChats.map(c =>
        c.id === chatId ? { ...c, minimized: !c.minimized } : c
      )
    );
  };

  const value = {
    openChats,
    openChat,
    closeChat,
    toggleMinimizeChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
