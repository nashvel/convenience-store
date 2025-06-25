import React, { useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'admin' }]);
      setNewMessage('');
    }
  };

  return (
    <>
      <PageMeta title="Admin Chat" description="Admin chat interface" />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Chat</h1>
        
        <Card className="mb-6">
          <div className="p-6 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-50 ml-auto' : 'bg-gray-50 mr-auto'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-md"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Active Chats</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white">C</span>
                </div>
                <span>Client Chat #1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white">S</span>
                </div>
                <span>Store Chat #1</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminChat;
