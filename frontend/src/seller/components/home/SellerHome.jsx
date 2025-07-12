import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaDollarSign, FaShoppingCart, FaBox } from 'react-icons/fa';

// Mock Data
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 },
  { name: 'Fri', sales: 6000 },
  { name: 'Sat', sales: 5500 },
  { name: 'Sun', sales: 7000 },
];

const topProductsData = [
  { name: 'Laptop', sold: 45 },
  { name: 'Mouse', sold: 120 },
  { name: 'Keyboard', sold: 78 },
  { name: 'Monitor', sold: 32 },
  { name: 'Webcam', sold: 95 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Accessories', value: 300 },
  { name: 'Peripherals', value: 300 },
  { name: 'Components', value: 200 },
];

const COLORS = ['#1E88E5', '#42A5F5', '#64B5F6', '#90CAF9'];

const SummaryCard = ({ icon, title, value, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-blue-900">{value}</h3>
      <p className="text-blue-700 font-medium">{title}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
    <h2 className="text-xl font-bold text-blue-800 mb-4">{title}</h2>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

const SellerHome = () => {
  const [animatedData, setAnimatedData] = useState(categoryData.map(item => ({ ...item, value: 0 })));

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedData(categoryData), 100);
    return () => clearTimeout(timer);
  }, []);
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <SummaryCard 
        icon={<FaDollarSign className="text-white text-3xl" />} 
        title="Total Sales" 
        value="₱24,800" 
        colorClass="bg-blue-500"
      />
      <SummaryCard 
        icon={<FaShoppingCart className="text-white text-3xl" />} 
        title="New Orders" 
        value="350" 
        colorClass="bg-blue-400"
      />
      <SummaryCard 
        icon={<FaBox className="text-white text-3xl" />} 
        title="Products In Stock" 
        value="1,250" 
        colorClass="bg-blue-300"
      />

      <ChartCard title="Sales Trend (Last 7 Days)" className="md:col-span-2 lg:col-span-2">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#1E88E5" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Category Distribution" className="md:col-span-1 lg:col-span-1">
        <PieChart>
          <Pie
            data={animatedData}
            animationDuration={1000}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartCard>

      <ChartCard title="Top Selling Products" className="md:col-span-2 lg:col-span-3">
        <AreaChart data={topProductsData}>
          <defs>
            <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#42A5F5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
          <Legend />
          <Area type="monotone" dataKey="sold" stroke="#1E88E5" fill="url(#colorSold)" />
        </AreaChart>
      </ChartCard>
    </div>
  );
};

export default SellerHome;
