import React, { useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";

const StoreChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);

  const stores = [
    { id: 1, name: 'Burger House', lastMessage: 'Order confirmation', lastMessageTime: '10:30 AM' },
    { id: 2, name: 'Pizza Palace', lastMessage: 'Delivery update', lastMessageTime: '11:15 AM' },
    { id: 3, name: 'Coffee Shop', lastMessage: 'Menu update', lastMessageTime: '9:45 AM' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedStore) {
      setMessages([...messages, { text: newMessage, sender: 'admin' }]);
      setNewMessage('');
    }
  };

  return (
    <>
      <PageMeta title="Store Chat" description="Manage store conversations" />
      <div className="p-6 flex">
        <div className="w-1/4 pr-4">
          <Card className="h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Stores</h2>
              <div className="space-y-2">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedStore === store.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{store.name}</h3>
                        <p className="text-sm text-gray-600">{store.lastMessage}</p>
                      </div>
                      <span className="text-sm text-gray-500">{store.lastMessageTime}</span>
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
              {selectedStore ? (
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
                  <p className="text-gray-600">Select a store to start chatting</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StoreChat;
