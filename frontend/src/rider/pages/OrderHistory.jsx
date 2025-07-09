import React, { useState, useEffect } from 'react';
import OrderListSkeleton from '../skeletons/OrderListSkeleton';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < breakpoint);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const OrderHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate API call to fetch order history
    const timer = setTimeout(() => {
      const fetchedHistory = [
        { id: 'ORD-101', date: '2023-10-26', earnings: '₱120.00', status: 'Completed' },
        { id: 'ORD-102', date: '2023-10-26', earnings: '₱95.50', status: 'Completed' },
        { id: 'ORD-103', date: '2023-10-25', earnings: '₱150.00', status: 'Cancelled' },
        { id: 'ORD-104', date: '2023-10-24', earnings: '₱88.00', status: 'Completed' },
        { id: 'ORD-105', date: '2023-10-23', earnings: '₱210.25', status: 'Completed' },
      ];
      setHistory(fetchedHistory);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <OrderListSkeleton count={5} />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
      
            {isMobile ? (
        <div className="space-y-4">
          {history.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-800 text-lg">{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{order.date}</span>
                <span className="text-green-600 font-bold">{order.earnings}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 font-semibold text-gray-600">Order ID</th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Earnings</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">{order.id}</td>
                    <td className="p-4 text-gray-600">{order.date}</td>
                    <td className="p-4 text-green-600 font-semibold">{order.earnings}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
