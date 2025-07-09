import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { FaPaperPlane, FaSearch, FaImage, FaVideo, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { getChats, getMessages, sendMessage } from '../../../api/chatApi';
import { format } from 'date-fns';
import Avatar from '../../../components/Avatar/Avatar';

const Chat = () => {
  const { user } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const [filePreviews, setFilePreviews] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch all conversations on component mount
  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const fetchedChats = await getChats();
        // Add avatar_url for compatibility with the Avatar component
        const formattedChats = fetchedChats.map(chat => ({
          ...chat,
          other_user: chat.other_user ? {
            ...chat.other_user,
            avatar_url: chat.other_user.avatar
          } : null
        }));
        setChats(formattedChats);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  const fetchMessages = useCallback(async (showLoading = true) => {
    if (!selectedChat) return;

    if (showLoading) {
      setLoadingMessages(true);
    }
    try {
      const fetchedMessages = await getMessages(selectedChat.id);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      
      const formattedMessages = fetchedMessages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.message,
        timestamp: msg.created_at,
        media: msg.media ? msg.media.map(m => ({
          ...m,
          media_url: `${API_URL}/${m.media_url}`
        })) : [],
      }));

      setMessages(currentMessages => {
        const currentServerMessages = currentMessages.filter(m => !m.isSending);
        // Avoid re-render if server data hasn't changed
        if (JSON.stringify(currentServerMessages) === JSON.stringify(formattedMessages)) {
          return currentMessages;
        }
        const optimisticMessages = currentMessages.filter(m => m.isSending);
        return [...formattedMessages, ...optimisticMessages];
      });

    } catch (error) {
      console.error(`Failed to fetch messages for chat ${selectedChat.id}`, error);
      if (showLoading) {
        setMessages([]);
      }
    } finally {
      if (showLoading) {
        setLoadingMessages(false);
      }
    }
  }, [selectedChat?.id]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(true);
    } else {
      setMessages([]); // Clear messages when no chat is selected
    }
  }, [selectedChat, fetchMessages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!selectedChat) return;

    const intervalId = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedChat, fetchMessages]);

  // Scroll to the bottom of the message list
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const files = filePreviews.map(p => p.file);
    if ((!newMessage.trim() && files.length === 0) || !selectedChat) return;

    const formData = new FormData();
    if (newMessage.trim()) {
      formData.append('text', newMessage.trim());
    }
    if (files.length > 0) {
      files.forEach(file => {
        formData.append('media[]', file);
      });
    }

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      senderId: user.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isSending: true,
      media: filePreviews.map(p => ({
        id: `temp_media_${Math.random()}`,
        media_type: p.file.type.startsWith('image/') ? 'image' : 'video',
        media_url: p.url, // Reuse preview URL
        isUploading: true,
      })),
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setFilePreviews([]); // URLs are now owned by optimisticMessage, so just clear the array

    try {
      const savedMessage = await sendMessage(selectedChat.id, formData);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const formattedMessage = {
        ...savedMessage,
        senderId: savedMessage.sender_id,
        text: savedMessage.message,
        timestamp: savedMessage.created_at,
        media: savedMessage.media.map(m => ({ ...m, media_url: `${API_URL}/${m.media_url}` }))
      };
      
      // On success, revoke the blob URLs as they are now replaced by server URLs
      optimisticMessage.media.forEach(m => URL.revokeObjectURL(m.media_url));
      setMessages(prev => prev.map(m => m.id === tempId ? formattedMessage : m));

    } catch (error) {
      console.error('Failed to send message:', error);
      // On error, also revoke the blob URLs as the message is being removed
      optimisticMessage.media.forEach(m => URL.revokeObjectURL(m.media_url));
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setFilePreviews(prev => {
        const updated = [...prev, ...newPreviews];
        if (updated.length > 5) {
            const toRemove = updated.splice(0, updated.length - 5);
            toRemove.forEach(p => URL.revokeObjectURL(p.url));
        }
        return updated;
    });
    e.target.value = null;
  };

  const removeSelectedFile = (previewToRemove) => {
    URL.revokeObjectURL(previewToRemove.url);
    setFilePreviews(prev => prev.filter(p => p.url !== previewToRemove.url));
  };

  const renderLastMessage = (lastMessage) => {
    if (!lastMessage) {
      return 'No messages yet';
    }
    if (lastMessage.message) {
      return lastMessage.message;
    }
    if (lastMessage.media_type && typeof lastMessage.media_type === 'string') {
      const isImage = lastMessage.media_type.startsWith('image');
      return (
        <span className="flex items-center gap-1">
          {isImage ? <FaImage /> : <FaVideo />}
          {isImage ? 'Image' : 'Video'}
        </span>
      );
    }
    // If last_message exists but has no text and no valid media_type
    return '...';
  };



  const filteredChats = useMemo(() =>
    chats.filter(chat => {
      if (!chat.other_user) return false;
      const fullName = `${chat.other_user.first_name} ${chat.other_user.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }),
    [chats, searchTerm]
  );

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Contact List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-primary" size={24} /></div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 flex items-center gap-4 cursor-pointer rounded-lg transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                <div className="relative">
                  <Avatar user={chat.other_user} className="w-12 h-12 rounded-full" textSize="text-xl" />
                </div>
                <div className="flex-grow overflow-hidden">
                    <span className="font-semibold text-gray-800">{(chat.other_user && `${chat.other_user.first_name} ${chat.other_user.last_name}`) || 'Deleted User'}</span>
                    <p className="text-sm text-gray-500 truncate">{renderLastMessage(chat.last_message)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conversation View */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
              <Avatar user={selectedChat.other_user} className="w-12 h-12 rounded-full" textSize="text-xl" />
              <h3 className="text-xl font-bold text-gray-800">{(selectedChat.other_user && `${selectedChat.other_user.first_name} ${selectedChat.other_user.last_name}`) || 'Deleted User'}</h3>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-6 overflow-y-auto bg-gray-100">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-primary" size={24} /></div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex items-end gap-3 my-2 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} ${msg.isSending ? 'opacity-60' : ''}`}>
                    {msg.senderId !== user.id && <Avatar user={selectedChat.other_user} className="w-8 h-8 rounded-full" textSize="text-sm" />}
                    <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.senderId === user.id ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                        {msg.text && <p>{msg.text}</p>}
                        {msg.media && msg.media.length > 0 && (
                          <div className="mt-2 flex flex-col gap-2">
                            {msg.media.map(mediaItem => (
                              <div key={mediaItem.id || mediaItem.media_url} className="relative">
                                {mediaItem.media_type === 'image' ? (
                                  <img src={mediaItem.media_url} alt="attachment" className="rounded-md max-w-full" />
                                ) : (
                                  <video src={mediaItem.media_url} controls className="rounded-md max-w-full" />
                                )}
                                {(mediaItem.isUploading || msg.isSending) && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                    <FaSpinner className="animate-spin text-white" size={24} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-right mt-1 opacity-70">
                            {format(new Date(msg.timestamp), 'p')}
                            {msg.isSending && <span className="ml-1">(Sending...)</span>}
                        </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {filePreviews.length > 0 && (
                <div className="p-2 flex gap-2 overflow-x-auto border-b mb-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      {preview.file.type.startsWith('image/') ? (
                        <img src={preview.url} alt="preview" className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                          <FaVideo className="text-white" size={24} />
                        </div>
                      )}
                      <button onClick={() => removeSelectedFile(preview)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 flex items-center justify-center w-4 h-4">
                        <FaTimes size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full pr-28 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,video/*"
                    />
                    <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-primary"><FaImage size={20}/></button>
                    <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-primary"><FaVideo size={20}/></button>
                </div>
                <button onClick={handleSendMessage} disabled={(!newMessage.trim() && filePreviews.length === 0)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {loadingChats ? <FaSpinner className="animate-spin text-primary" size={32} /> : 'Select a conversation to start chatting'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
