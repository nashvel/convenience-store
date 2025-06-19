import React, { useState } from 'react';
import { FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaMotorcycle, FaCheck, FaTimes, FaTags, FaRulerCombined, FaInfoCircle } from 'react-icons/fa';

const mockOrders = [
  {
    id: 'ORD-12345',
    customer: 'Ann Angel',
    product: {
      name: 'Wireless Mouse',
      category: 'Electronics',
      imageUrl: '/assets/products/mouse.png',
      quantity: 1,
      size: '44mm',
    },
    payment: 'Credit Card',
    address: 'Crossing Libona Bukidnon',
  },
  {
    id: 'ORD-12346',
    customer: 'Jay Nashvel',
    product: {
      name: 'Umbrella',
      category: 'Home Decor',
      imageUrl: '/assets/products/candles.png',
      quantity: 2,
      size: 'Medium',
    },
    payment: 'Cash on Delivery',
    address: 'Poblacion, Alubijid',
  },
  {
    id: 'ORD-12347',
    customer: 'John Doe',
    product: {
      name: 'Scented Candles',
      category: 'Furniture',
      imageUrl: '/assets/products/umbrella.png',
      quantity: 1,
      size: '3-Tier',
    },
    payment: 'Stripe',
    address: 'Tagoloan Community College',
  },
];

const mockRiders = ['Rider A', 'Rider B', 'Rider C'];

const TabButton = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>{count}</span>
  </button>
);

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
    <div className="w-5 text-center text-gray-400">{icon}</div>
    <span>{text}</span>
  </div>
);

const OrderCard = ({ order, onAccept, onDecline, isTransaction = false }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 text-lg">#{order.id}</h3>
        <p className="text-gray-600 font-semibold">{order.customer}</p>
      </div>
      
      <div className="flex gap-4 items-center border-t border-b border-gray-100 py-4">
        <img src={order.product.imageUrl} alt={order.product.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
        <div className="flex-grow">
          <p className="font-bold text-gray-800">{order.product.name}</p>
          <InfoItem icon={<FaTags />} text={order.product.category} />
          <InfoItem icon={<FaBoxOpen />} text={`Quantity: ${order.product.quantity}`} />
          <InfoItem icon={<FaRulerCombined />} text={`Size: ${order.product.size}`} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <InfoItem icon={<FaCreditCard />} text={order.payment} />
        <InfoItem icon={<FaMapMarkerAlt />} text={order.address} />
        {!isTransaction && (
          <div className="flex items-center gap-3">
            <div className="w-5 text-center text-gray-400"><FaMotorcycle /></div>
            <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-light outline-none">
              <option value="">Assign Rider</option>
              {mockRiders.map(rider => (<option key={rider} value={rider}>{rider}</option>))}
            </select>
          </div>
        )}
      </div>

      {!isTransaction && (
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100">
          <button onClick={() => onAccept(order.id)} className="w-full py-2.5 px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><FaCheck /> Accept</button>
          <button onClick={() => onDecline(order.id)} className="w-full py-2.5 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"><FaTimes /> Decline</button>
        </div>
      )}
    </div>
);

const Orders = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingOrders, setIncomingOrders] = useState(mockOrders);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const handleDecline = (orderId) => {
    setIncomingOrders(incomingOrders.filter(order => order.id !== orderId));
  };

  const handleAccept = (orderId) => {
    const orderToAccept = incomingOrders.find(order => order.id === orderId);
    if (orderToAccept) {
      setAcceptedOrders([...acceptedOrders, orderToAccept]);
      setIncomingOrders(incomingOrders.filter(order => order.id !== orderId));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
      <div className="border-b border-gray-200">
        <div className="flex -mb-px">
          <TabButton label="Incoming Orders" count={incomingOrders.length} isActive={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')} />
          <TabButton label="Transactions" count={acceptedOrders.length} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'incoming' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {incomingOrders.map((order) => (
              <OrderCard key={order.id} order={order} onAccept={handleAccept} onDecline={handleDecline} />
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-6 flex items-center gap-3">
              <FaInfoCircle className="text-xl" />
              <p className="font-semibold">Orders can still be cancelled if not yet shipped.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {acceptedOrders.map((order) => (
                <OrderCard key={order.id} order={order} isTransaction={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;