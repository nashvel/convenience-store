import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getMessages, sendMessage as sendMessageApi, findOrCreateChat } from '../api/chatApi';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [openChats, setOpenChats] = useState({}); // Keyed by recipientId

  const fetchMessages = useCallback(async (chatId, recipientId) => {
    try {
      const fetchedMessages = await getMessages(chatId);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const formattedMessages = fetchedMessages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.message,
        timestamp: msg.created_at,
        media: msg.media ? msg.media.map(m => ({ ...m, media_url: `${API_URL}/${m.media_url}` })) : [],
      }));

      setOpenChats(prev => {
        const chat = prev[recipientId];
        if (!chat) return prev; // Chat was closed in the meantime

        const currentMessages = chat.messages || [];
        const optimisticMessages = currentMessages.filter(m => m.isSending);
        const currentServerMessages = currentMessages.filter(m => !m.isSending);

        // Avoid re-render if server data hasn't changed
        if (JSON.stringify(currentServerMessages) === JSON.stringify(formattedMessages)) {
          return prev;
        }

        return {
          ...prev,
          [recipientId]: {
            ...chat,
            messages: [...formattedMessages, ...optimisticMessages],
            isLoading: false,
          },
        };
      });
    } catch (error) {
      console.error(`Failed to fetch messages for chat ${chatId}`, error);
      setOpenChats(prev => {
        if (!prev[recipientId]) return prev;
        return { ...prev, [recipientId]: { ...prev[recipientId], isLoading: false } };
      });
    }
  }, []);

  const openChat = async (recipient) => {
    if (!recipient || !recipient.id) {
      console.error("Recipient is invalid", recipient);
      return;
    }

    if (openChats[recipient.id]) {
      setOpenChats(prev => ({
        ...prev,
        [recipient.id]: { ...prev[recipient.id], minimized: false }
      }));
      return;
    }

    let currentOpenChats = { ...openChats };
    if (Object.keys(currentOpenChats).length >= 3) {
      const oldestChatKey = Object.keys(currentOpenChats)[0];
      delete currentOpenChats[oldestChatKey];
    }

    currentOpenChats[recipient.id] = {
      recipient: { ...recipient, name: recipient.name },
      chatId: null,
      messages: [],
      isLoading: true,
      minimized: false,
    };
    setOpenChats(currentOpenChats);

    try {
      const chat = await findOrCreateChat(recipient.id);
      if (!chat || !chat.id) throw new Error("Failed to find or create a chat.");

      setOpenChats(prev => {
        if (!prev[recipient.id]) return prev;
        return {
            ...prev,
            [recipient.id]: { ...prev[recipient.id], chatId: chat.id },
        }
      });

      await fetchMessages(chat.id, recipient.id);

    } catch (error) {
      console.error("Failed to open chat", error);
      closeChat(recipient.id);
    }
  };

  const closeChat = (recipientId) => {
    setOpenChats(prev => {
      const newChats = { ...prev };
      if (newChats[recipientId] && newChats[recipientId].messages) {
        newChats[recipientId].messages.forEach(msg => {
          if (msg.media) {
            msg.media.forEach(m => {
              if (m.isUploading) URL.revokeObjectURL(m.media_url);
            });
          }
        });
      }
      delete newChats[recipientId];
      return newChats;
    });
  };

  const toggleMinimizeChat = (recipientId) => {
    setOpenChats(prev => {
      if (!prev[recipientId]) return prev;
      return {
        ...prev,
        [recipientId]: { ...prev[recipientId], minimized: !prev[recipientId].minimized }
      };
    });
  };

  const handleSendMessage = async (recipientId, messageData) => {
    const chat = openChats[recipientId];
    if (!chat || !chat.chatId) return;

    const { text, files } = messageData;
    const { chatId } = chat;
    const tempId = `temp_${Date.now()}`;

    const optimisticMessage = {
      id: tempId,
      senderId: user.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isSending: true,
      media: files.map(file => ({
        id: `temp_media_${Math.random()}`,
        media_type: file.type.startsWith('image/') ? 'image' : 'video',
        media_url: URL.createObjectURL(file),
        isUploading: true,
      })),
    };

    setOpenChats(prev => ({
      ...prev,
      [recipientId]: {
        ...prev[recipientId],
        messages: [...prev[recipientId].messages, optimisticMessage]
      }
    }));

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (files.length > 0) files.forEach(file => formData.append('media[]', file));

      const savedMessage = await sendMessageApi(chatId, formData);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const formattedMessage = {
        ...savedMessage,
        senderId: savedMessage.sender_id,
        text: savedMessage.message,
        timestamp: savedMessage.created_at,
        media: savedMessage.media ? savedMessage.media.map(m => ({ ...m, media_url: `${API_URL}/${m.media_url}` })) : [],
      };

      setOpenChats(prev => {
        if (!prev[recipientId]) return prev;
        const newMessages = prev[recipientId].messages.map(m =>
          m.id === tempId ? formattedMessage : m
        );
        optimisticMessage.media.forEach(m => URL.revokeObjectURL(m.media_url));
        return {
          ...prev,
          [recipientId]: { ...prev[recipientId], messages: newMessages }
        };
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setOpenChats(prev => {
        if (!prev[recipientId]) return prev;
        optimisticMessage.media.forEach(m => URL.revokeObjectURL(m.media_url));
        return {
          ...prev,
          [recipientId]: {
            ...prev[recipientId],
            messages: prev[recipientId].messages.filter(m => m.id !== tempId)
          }
        };
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      Object.values(openChats).forEach(chat => {
        if (chat.chatId && !chat.minimized) {
          fetchMessages(chat.chatId, chat.recipient.id);
        }
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, [openChats, fetchMessages]);

  const value = {
    openChats,
    openChat,
    closeChat,
    toggleMinimizeChat,
    sendMessage: handleSendMessage,
    currentUserId: user?.id,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
