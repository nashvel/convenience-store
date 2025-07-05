import React from 'react';

const OrderHistory = () => {
  // Placeholder data for the prototype
  const history = [
    { id: 'ORD-101', date: '2023-10-26', earnings: '₱120.00', status: 'Completed' },
    { id: 'ORD-102', date: '2023-10-26', earnings: '₱95.50', status: 'Completed' },
    { id: 'ORD-103', date: '2023-10-25', earnings: '₱150.00', status: 'Cancelled' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Add search/filter controls here later */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Earnings</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-700">{order.id}</td>
                  <td className="p-4 text-gray-600">{order.date}</td>
                  <td className="p-4 text-green-600 font-semibold">{order.earnings}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
