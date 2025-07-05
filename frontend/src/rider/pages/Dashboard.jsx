import React, { cloneElement, useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import OrderCard from '../components/OrderCard';
import ChartSkeleton from '../components/ChartSkeleton';
import PhilippinesMap from '../components/PhilippinesMap';
import Loading from '../components/Loading';

const weeklyData = [
  { day: 'Mon', earnings: 1250 },
  { day: 'Tue', earnings: 1500 },
  { day: 'Wed', earnings: 980 },
  { day: 'Thu', earnings: 1780 },
  { day: 'Fri', earnings: 2100 },
  { day: 'Sat', earnings: 2500 },
  { day: 'Sun', earnings: 1890 },
];

const Dashboard = ({ availableOrders, loading, handleAcceptOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [chartLoading, setChartLoading] = useState(true);

  const stats = [
    { title: "Today's Earnings", value: "₱1,250.00", icon: <FaMoneyBillWave className="text-blue-500" /> },
    { title: "Completed Trips", value: "15", icon: <FaCheckCircle className="text-blue-500" /> },
    { title: "Available Orders", value: availableOrders.length, icon: <FaBoxOpen className="text-blue-500" /> },
  ];

  const filteredAndSortedOrders = availableOrders
    .filter(order => 
      order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'earnings') {
        return (b.total * 0.15) - (a.total * 0.15);
      } else if (sortBy === 'distance') {
        // Replace with actual distance calculation later
        return (a.id.length % 5) - (b.id.length % 5); // Dummy distance
      }
      return 0;
    });

  useEffect(() => {
    const timer = setTimeout(() => setChartLoading(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              {cloneElement(stat.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {chartLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h2>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₱${value/1000}k`} />
                    <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                    <Bar dataKey="earnings" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <PhilippinesMap />
        </div>
      </div>

      {/* Available Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Available for Pickup</h2>
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              placeholder="Filter by store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="default">Sort by...</option>
              <option value="earnings">Highest Earnings</option>
              <option value="distance">Closest Distance</option>
            </select>
          </div>
        </div>

        {filteredAndSortedOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedOrders.map(order => (
              <OrderCard key={order.id} order={order} onAccept={handleAcceptOrder} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500 border border-gray-200">
            <p>No available orders match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
