import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { getChats } from '../api/chatApi';
import { formatInTimeZone } from 'date-fns-tz';
import getAvatarUrl from '../utils/getAvatarUrl';
import { isToday } from 'date-fns';
import { FaImage, FaVideo, FaSpinner, FaTimes } from 'react-icons/fa';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const MessageDropdown = ({ closeDropdown, chats, loading }) => {
  const { openChat } = useChat();
  const dropdownRef = React.useRef();

  useClickOutside(dropdownRef, () => closeDropdown());



  const renderLastMessage = (lastMessage) => {
    if (!lastMessage) return 'No messages yet';
    if (lastMessage.message) return lastMessage.message;
    if (lastMessage.media_type && typeof lastMessage.media_type === 'string') {
      const isImage = lastMessage.media_type.startsWith('image');
      return (
        <span className="flex items-center gap-1">
          {isImage ? <FaImage /> : <FaVideo />}
          {isImage ? 'Image' : 'Video'}
        </span>
      );
    }
    return '...';
  };

  const handleOpenChat = (chat) => {
    if (chat.other_user) {
        openChat(chat.other_user);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Messages</h3>
        <button onClick={closeDropdown} className="p-1 rounded-full hover:bg-gray-200">
          <FaTimes className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
            <div className="p-3 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
        ) : chats.length === 0 ? (
            <p className="text-center text-gray-500 p-4">No recent conversations.</p>
        ) : (
          chats.map(chat => (
            <button
              onClick={() => handleOpenChat(chat)}
              key={chat.id}
              className="flex items-center w-full text-left p-3 hover:bg-gray-50 transition-colors relative"
            >
              <div className="relative mr-4">
                <img
                  src={getAvatarUrl(chat.other_user)}
                  alt={chat.other_user?.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1 overflow-hidden pr-8">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-800 truncate">
                    {chat.other_user?.name || 'Deleted User'}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {chat.last_message ? formatInTimeZone(new Date(chat.last_message.created_at), 'Asia/Manila', isToday(new Date(chat.last_message.created_at)) ? 'p' : 'MMM d') : ''}
                  </span>
                </div>
                <p className={`text-sm truncate ${chat.unread_count > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {renderLastMessage(chat.last_message)}
                </p>
              </div>
              {chat.unread_count > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unread_count}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageDropdown;
