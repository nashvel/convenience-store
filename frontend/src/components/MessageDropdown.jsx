import React from 'react';
import { useChat } from '../context/ChatContext';

const dummyMessages = [
  {
    id: 1,
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    message: 'Hey, is the new collection out yet?',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'You: Okay, sounds good!',
    time: '1h ago',
    unread: false,
  },
  {
    id: 3,
    name: 'EcomXpert Support',
    avatar: 'https://i.pravatar.cc/150?u=support',
    message: 'Your ticket has been updated.',
    time: '3h ago',
    unread: true,
  },
];

const MessageDropdown = () => {
  const { openChat } = useChat();
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold text-gray-800">Messages</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {dummyMessages.map(msg => (
          <button onClick={() => openChat(msg)} key={msg.id} className="flex items-center w-full text-left p-3 hover:bg-gray-50 transition-colors">
            <div className="relative mr-4">
              <img src={msg.avatar} alt={msg.name} className="w-12 h-12 rounded-full" />
              {msg.active && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800">{msg.name}</p>
                {msg.unread && <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>}
              </div>
              <p className={`text-sm ${msg.unread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                {msg.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageDropdown;
