import React, { useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const ClientChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const clients = [
    { id: 1, name: 'John Doe', lastMessage: 'Hi there!', lastMessageTime: '10:30 AM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Need help with order', lastMessageTime: '11:15 AM' },
    { id: 3, name: 'Bob Johnson', lastMessage: 'Thank you!', lastMessageTime: '9:45 AM' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedClient) {
      setMessages([...messages, { text: newMessage, sender: 'admin' }]);
      setNewMessage('');
    }
  };

  return (
    <>
      <PageMeta title="Client Chat" description="Manage client conversations" />
      <div className="p-6 flex">
        <div className="w-1/4 pr-4">
          <Card className="h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Clients</h2>
              <div className="space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedClient === client.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.lastMessage}</p>
                      </div>
                      <span className="text-sm text-gray-500">{client.lastMessageTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="flex-1">
          <Card>
            <div className="p-6 h-[600px] flex flex-col">
              {selectedClient ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        msg.sender === 'admin' ? 'bg-blue-50 ml-auto' : 'bg-gray-50 mr-auto'
                      }`}>
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
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">Select a client to start chatting</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ClientChat;
