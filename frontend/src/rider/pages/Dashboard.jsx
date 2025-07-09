import React, { cloneElement, useState, useEffect } from 'react';
import api from '../../api/axios-config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaMoneyBillWave, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import OrderCard from '../components/OrderCard';
import ChartSkeleton from '../components/ChartSkeleton';
import PhilippinesMap from '../components/PhilippinesMap';
import DashboardSkeleton from '../skeletons/DashboardSkeleton';

const weeklyData = [
  { day: 'Mon', earnings: 1250 },
  { day: 'Tue', earnings: 1500 },
  { day: 'Wed', earnings: 980 },
  { day: 'Thu', earnings: 1780 },
  { day: 'Fri', earnings: 2100 },
  { day: 'Sat', earnings: 2500 },
  { day: 'Sun', earnings: 1890 },
];

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

const Dashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const isMobile = useIsMobile();

  const chartConfig = {
    margin: isMobile ? { top: 5, right: 5, left: -20, bottom: 5 } : { top: 5, right: 20, left: -10, bottom: 5 },
    tick: { fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: isMobile ? 12 : 14 },
    barSize: isMobile ? 15 : 20,
  };

  const stats = [
    { title: "Today's Earnings", value: "₱1,250.00", icon: <FaMoneyBillWave /> },
    { title: "Completed Trips", value: "15", icon: <FaCheckCircle /> },
    { title: "Active Deliveries", value: assignedOrders.length, icon: <FaBoxOpen /> },
  ];

  const fetchAssignedOrders = async () => {
    if (!user) return;
    console.log(`Fetching assigned orders for rider ID: ${user.id}`);
    try {
        setLoading(true);
        const response = await api.get(`/orders?rider_id=${user.id}`);
        if (response.data.success) {
            const activeDeliveries = response.data.orders.filter(
                order => order.status === 'accepted' || order.status === 'in_transit'
            );
            setAssignedOrders(activeDeliveries);
        } else {
            console.error('Failed to fetch orders:', response.data.message);
        }
    } catch (error) {
        console.error('Failed to fetch assigned orders', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
      fetchAssignedOrders();
    }
    const timer = setTimeout(() => setChartLoading(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-gradient-to-tr from-blue-500 to-cyan-400 text-white rounded-full shadow-lg">
              {cloneElement(stat.icon, { size: 20 })}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
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
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Weekly Performance</h2>
              <div style={{ width: '100%', height: isMobile ? 240 : 300 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyData} margin={chartConfig.margin}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={chartConfig.tick} />
                    <YAxis tickLine={false} axisLine={false} tick={chartConfig.tick} tickFormatter={(value) => `₱${value/1000}k`} />
                    <Tooltip cursor={{ fill: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(239, 246, 255, 0.5)' }} contentStyle={{ backgroundColor: theme === 'dark' ? '#1F2937' : '#ffffff', border: '1px solid', borderColor: theme === 'dark' ? '#374151' : '#e5e7eb', borderRadius: '0.5rem' }} />
                    <Bar dataKey="earnings" fill="#3B82F6" barSize={chartConfig.barSize} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 h-80 lg:h-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Live Orders Map</h2>
          <div className="flex-grow min-h-0">
            <PhilippinesMap orders={assignedOrders} defaultZoom={16} />
          </div>
        </div>
      </div>

      {/* My Assigned Deliveries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Assigned Deliveries</h2>
        {assignedOrders.length > 0 ? (
          <div className={`space-y-4 overflow-y-auto ${isMobile ? 'max-h-80' : 'max-h-[500px]'}`}>
            {assignedOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdate={fetchAssignedOrders} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center text-gray-500 dark:text-gray-400">
            <p>You have no assigned deliveries at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
