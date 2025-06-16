import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const COLORS = ['#FF5722', '#00C49F', '#FFBB28', '#0088FE'];

// Styled Components
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SummaryCard = styled(Card)`
  grid-column: span 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const SummaryIcon = styled.div`
  ${({ theme }) => theme.neumorphism(true, '50%')};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primary};
`;

const SummaryInfo = styled.div`
  h3 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.text};
    margin: 0;
  }
  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.textSecondary};
    margin: 0;
  }
`;

const ChartCard = styled(Card)`
  grid-column: span 2;
  min-height: 400px;
  @media (max-width: 900px) {
    grid-column: span 1;
  }
`;

const PieChartCard = styled(Card)`
    grid-column: span 1;
    min-height: 400px;
`;

const CardTitle = styled.h2`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

const ClientHome = () => {
  return (
    <DashboardGrid>
      <SummaryCard>
        <SummaryIcon><FaDollarSign /></SummaryIcon>
        <SummaryInfo>
          <h3>₱24,800</h3>
          <p>Total Sales</p>
        </SummaryInfo>
      </SummaryCard>
      <SummaryCard>
        <SummaryIcon><FaShoppingCart /></SummaryIcon>
        <SummaryInfo>
          <h3>350</h3>
          <p>New Orders</p>
        </SummaryInfo>
      </SummaryCard>
      <SummaryCard>
        <SummaryIcon><FaBox /></SummaryIcon>
        <SummaryInfo>
          <h3>1,250</h3>
          <p>Products In Stock</p>
        </SummaryInfo>
      </SummaryCard>

      <ChartCard>
        <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#FF5722" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <PieChartCard>
        <CardTitle>Category Distribution</CardTitle>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </PieChartCard>

      <ChartCard style={{ gridColumn: 'span 3' }}>
        <CardTitle>Top Selling Products</CardTitle>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topProductsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Legend />
            <Bar dataKey="sold" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </DashboardGrid>
  );
};

export default ClientHome;
