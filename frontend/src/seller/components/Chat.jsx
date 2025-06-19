import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSearch, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

// Mock Data
const mockContacts = [
  { id: 1, name: 'Angel', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 2, name: 'Nash', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 4, name: 'David', avatar: 'https://i.pravatar.cc/150?u=david' },
  { id: 5, name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve' },
  { id: 6, name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=frank' },
  { id: 7, name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=grace' },
  { id: 8, name: 'Heidi', avatar: 'https://i.pravatar.cc/150?u=heidi' },
];

const mockMessages = {
  1: [
    { id: 1, sender: 'other', text: 'Hey, how are you?' },
    { id: 2, sender: 'me', text: 'I am good, thanks! How about you?' },
    { id: 3, sender: 'other', text: 'Doing great! Did you see the latest sales report?' },
  ],
  2: [{ id: 4, sender: 'other', text: 'Can we reschedule our meeting?' }],
  3: [{ id: 5, sender: 'me', text: 'Project update is on the way.' }],
  4: [], 5: [], 6: [], 7: [], 8: [],
};

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const handleSend = () => {
    if (newMessage.trim() === '' || !selectedContact) return;
    const newMsg = { id: Date.now(), sender: 'me', text: newMessage };
    const contactId = selectedContact.id;
    const updatedMessages = {
      ...messages,
      [contactId]: [...(messages[contactId] || []), newMsg],
    };
    setMessages(updatedMessages);
    setNewMessage('');
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingMessageText(message.text);
    setOpenMessageMenuId(null);
  };

  const handleSaveEdit = (contactId, messageId) => {
    const newMessages = { ...messages };
    const messageIndex = newMessages[contactId].findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      newMessages[contactId][messageIndex].text = editingMessageText;
      setMessages(newMessages);
    }
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleDeleteMessage = (contactId, messageId) => {
    const newMessages = { ...messages };
    newMessages[contactId] = newMessages[contactId].filter(m => m.id !== messageId);
    setMessages(newMessages);
    setOpenMessageMenuId(null);
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? 'bg-primary-light' : ''}`}
            >
              <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full" />
              <span className="font-semibold text-gray-800">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation View */}
      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-12 h-12 rounded-full" />
              <h3 className="text-xl font-bold text-gray-800">{selectedContact.name}</h3>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-6 overflow-y-auto bg-gray-100">
              {(messages[selectedContact.id] || []).map(msg => (
                <div key={msg.id} className={`flex items-end gap-3 my-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'other' && <img src={selectedContact.avatar} alt={selectedContact.name} className="w-8 h-8 rounded-full" />}
                  <div className="relative group">
                    {editingMessageId === msg.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(selectedContact.id, msg.id); }} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                          autoFocus
                        />
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save</button>
                        <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                      </form>
                    ) : (
                      <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                    )}
                    {msg.sender === 'me' && editingMessageId !== msg.id && (
                      <div className="absolute top-1/2 -left-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setOpenMessageMenuId(openMessageMenuId === msg.id ? null : msg.id)} className="text-gray-500 hover:text-gray-800">
                          <FaEllipsisV />
                        </button>
                        {openMessageMenuId === msg.id && (
                          <div className="absolute bottom-full -left-2 mb-1 w-32 bg-white border rounded-lg shadow-xl z-10">
                            <button onClick={() => handleEditMessage(msg)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><FaEdit /> Edit</button>
                            <button onClick={() => handleDeleteMessage(selectedContact.id, msg.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"><FaTrash /> Delete</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
