import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaMinus, FaPaperPlane, FaImage, FaVideo, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { formatInTimeZone } from 'date-fns-tz';
import getAvatarUrl from '../../utils/getAvatarUrl';

const ChatPopup = ({ chat, onClose, onToggleMinimize }) => {
    const { sendMessage, currentUserId } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Limit to 5 files
    e.target.value = null; // Allow selecting the same file again
  };

  const removeSelectedFile = (fileToRemove) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const submitMessage = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      sendMessage(chat.recipient.id, { text: newMessage, files: selectedFiles });
      setNewMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };
  return (
    <motion.div
      layout
      className="w-80 bg-white rounded-t-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
      animate={{ height: chat.minimized ? '52px' : '24rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div
        onClick={() => onToggleMinimize(chat.recipient.id)}
        className="flex items-center justify-between p-3 bg-primary text-white rounded-t-lg cursor-pointer flex-shrink-0"
      >
        <div className="flex items-center overflow-hidden">
          <div className="relative mr-3">
            <img src={getAvatarUrl(chat.recipient)} alt={chat.recipient?.name} className="w-8 h-8 rounded-full" />
            {chat.recipient?.active && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-primary"></span>
            )}
          </div>
          <span className="font-bold truncate">{chat.recipient?.name || 'Chat'}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMinimize(chat.recipient.id);
            }}
            className="text-white hover:bg-white/20 p-1 rounded-full"
          >
            <FaMinus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(chat.recipient.id);
            }}
            className="text-white hover:bg-white/20 p-1 rounded-full"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {!chat.minimized && (
          <motion.div
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {chat.loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                    <div className="h-10 rounded-lg bg-gray-300 w-2/3"></div>
                  </div>
                  <div className="flex justify-end items-end gap-2">
                    <div className="h-12 rounded-lg bg-gray-400 w-1/2"></div>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                    <div className="h-8 rounded-lg bg-gray-300 w-1/3"></div>
                  </div>
                  <div className="flex justify-end items-end gap-2">
                    <div className="h-10 rounded-lg bg-gray-400 w-3/4"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {chat.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUserId ? 'justify-end' : ''} ${msg.isSending ? 'opacity-60' : ''}`}>
                      {msg.senderId !== currentUserId && (
                        <img src={chat.avatar} alt={chat.name} className="w-6 h-6 rounded-full self-start" />
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-xs break-words ${msg.senderId === currentUserId ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
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
                                {(mediaItem.isUploading) && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                    <FaSpinner className="animate-spin text-white" size={24} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className={`text-xs mt-1 ${msg.senderId === currentUserId ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatInTimeZone(new Date(msg.timestamp), 'Asia/Manila', 'p')}
                          {msg.isSending && <span className="ml-1">(Sending...)</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                   <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white">
              {selectedFiles.length > 0 && (
                <div className="p-2 flex gap-2 overflow-x-auto border-b mb-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                          <FaVideo className="text-white" size={24} />
                        </div>
                      )}
                      <button onClick={() => removeSelectedFile(file)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 flex items-center justify-center w-4 h-4">
                        <FaTimes size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full bg-gray-100 border-transparent rounded-2xl px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={1}
                />
                                <button onClick={submitMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700 p-2 disabled:text-gray-400 disabled:cursor-not-allowed" disabled={!newMessage.trim() && selectedFiles.length === 0}>
                  <FaPaperPlane size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <button onClick={triggerFileInput} className="text-gray-500 hover:text-primary p-2">
                  <FaImage size={20} />
                </button>
                <button onClick={triggerFileInput} className="text-gray-500 hover:text-primary p-2">
                  <FaVideo size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatPopup;
