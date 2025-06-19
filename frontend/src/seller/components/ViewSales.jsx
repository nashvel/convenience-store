import React from 'react';

// Mock Data
const salesSummary = {
  totalRevenue: 52345.67,
  totalOrders: 876,
  averageOrderValue: 59.75,
};

const recentTransactions = [
  { id: 'TRX001', customer: 'Alice', date: '2024-07-21', amount: 75.50, status: 'Completed' },
  { id: 'TRX002', customer: 'Bob', date: '2024-07-21', amount: 32.00, status: 'Completed' },
  { id: 'TRX003', customer: 'Charlie', date: '2024-07-20', amount: 120.00, status: 'Completed' },
  { id: 'TRX004', customer: 'Diana', date: '2024-07-20', amount: 15.25, status: 'Shipped' },
  { id: 'TRX005', customer: 'Eve', date: '2024-07-19', amount: 250.90, status: 'Pending' },
];

const StatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1 rounded-full font-semibold text-xs';
  const statusClasses = {
    Completed: 'bg-green-100 text-green-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-gray-500 font-medium mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const ViewSales = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <SummaryCard title="Total Revenue" value={`₱${salesSummary.totalRevenue.toLocaleString()}`} />
        <SummaryCard title="Total Orders" value={salesSummary.totalOrders} />
        <SummaryCard title="Average Order Value" value={`₱${salesSummary.averageOrderValue.toFixed(2)}`} />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 font-semibold uppercase text-sm">Order ID</th>
              <th className="p-4 text-gray-600 font-semibold uppercase text-sm">Customer</th>
              <th className="p-4 text-gray-600 font-semibold uppercase text-sm">Date</th>
              <th className="p-4 text-gray-600 font-semibold uppercase text-sm">Amount</th>
              <th className="p-4 text-gray-600 font-semibold uppercase text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx, index) => (
              <tr key={tx.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="p-4 border-t border-gray-200 text-gray-700">{tx.id}</td>
                <td className="p-4 border-t border-gray-200 text-gray-700">{tx.customer}</td>
                <td className="p-4 border-t border-gray-200 text-gray-700">{tx.date}</td>
                <td className="p-4 border-t border-gray-200 text-gray-700">₱{tx.amount.toFixed(2)}</td>
                <td className="p-4 border-t border-gray-200 text-gray-700"><StatusBadge status={tx.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSales;
