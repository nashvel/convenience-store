import React from 'react';
import { FaTimes, FaMinus, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPopup = ({ chat, onClose, onToggleMinimize }) => {
  return (
    <motion.div
      layout
      className="w-80 bg-white rounded-t-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
      animate={{ height: chat.minimized ? '52px' : '24rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div
        onClick={() => onToggleMinimize(chat.id)}
        className="flex items-center justify-between p-3 bg-primary text-white rounded-t-lg cursor-pointer flex-shrink-0"
      >
        <div className="flex items-center overflow-hidden">
          <div className="relative mr-3">
            <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full" />
            {chat.active && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-primary"></span>
            )}
          </div>
          <span className="font-bold truncate">{chat.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMinimize(chat.id);
            }}
            className="text-white hover:bg-white/20 p-1 rounded-full"
          >
            <FaMinus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(chat.id);
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
              <div className="flex flex-col gap-3">
                <div className="flex items-end">
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                    <p>Hey, is the new collection out yet?</p>
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <div className="bg-primary text-white p-3 rounded-lg max-w-xs">
                    <p>Yes! It just launched today. You can find it under the 'New Arrivals' category.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="ml-3 text-primary hover:text-blue-700 p-2">
                <FaPaperPlane size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatPopup;
