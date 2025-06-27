import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, PhoneIcon, VideoCameraIcon, PaperClipIcon, EmojiHappyIcon, PaperAirplaneIcon } from '@heroicons/react/solid';

const mockConversations = {
  1: [
    { text: 'Your order is ready for pickup.', sender: 'store', time: '10 mins ago' },
    { text: 'We have received your payment. Thank you!', sender: 'store', time: '1 hour ago' },
  ],
  2: [
    { text: 'We are out of stock for the item you requested.', sender: 'store', time: '5 hours ago' },
  ],
  3: [
    { text: 'Welcome to our store! How can we help you today?', sender: 'store', time: '1 day ago' },
  ],
};

const mockStores = [
  { id: 1, name: 'Tech Gadgets', avatar: 'https://via.placeholder.com/100', lastMessage: 'Your order is ready for pickup.', time: '10 mins', online: true },
  { id: 2, name: 'Fashion Hub', avatar: 'https://via.placeholder.com/100', lastMessage: 'We are out of stock...', time: '5 hours', online: false },
  { id: 3, name: 'Bookworm Corner', avatar: 'https://via.placeholder.com/100', lastMessage: 'Welcome to our store!', time: '1 day', online: true },
];

const StoreChat = () => {
  const [stores, setStores] = useState(mockStores);
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [messages, setMessages] = useState(mockConversations[selectedStore.id] || []);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages(mockConversations[selectedStore.id] || []);
  }, [selectedStore]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'me', time: 'Just now' }]);
      setNewMessage('');
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  return (
    <div className="h-full p-6 flex flex-col">
      <div className="flex flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chats</h2>
            <div className="relative mt-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stores.map((store) => (
              <div key={store.id} onClick={() => handleStoreSelect(store)} className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedStore.id === store.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}>
                <div className="relative">
                  <img src={store.avatar} alt={store.name} className="w-12 h-12 rounded-full" />
                  {store.online && <span className="absolute bottom-0 right-0 block h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{store.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{store.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{store.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedStore ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <img src={selectedStore.avatar} alt={selectedStore.name} className="w-10 h-10 rounded-full" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{selectedStore.name}</h3>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                  <PhoneIcon className="w-6 h-6 cursor-pointer hover:text-blue-500" />
                  <VideoCameraIcon className="w-6 h-6 cursor-pointer hover:text-blue-500" />
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                      {msg.sender !== 'me' && <img src={selectedStore.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                      <div className={`px-4 py-3 rounded-xl max-w-md ${msg.sender === 'me' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex space-x-4">
                      <PaperClipIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500" />
                      <EmojiHappyIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500" />
                    </div>
                  </div>
                  <button type="submit" className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <PaperAirplaneIcon className="w-6 h-6 transform rotate-45" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Select a conversation to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreChat;
