import React from 'react';
import styled from 'styled-components';

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

const ViewSalesContainer = styled.div``;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const SummaryCard = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  padding: 25px;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 10px;
`;

const CardValue = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const TableContainer = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  padding: 30px;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 15px 0;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 600;
  border-bottom: 2px solid ${({ theme }) => theme.shadows.dark};
`;

const Td = styled.td`
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.shadows.dark}22;
  color: ${({ theme }) => theme.text};
`;

const StatusBadge = styled.span`
  padding: 8px 15px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  
  ${({ status, theme }) => {
    let color = theme.textSecondary;
    if (status === 'Completed') color = '#28a745'; // Green
    if (status === 'Shipped') color = theme.primary;
    if (status === 'Pending') color = '#ffc107'; // Yellow
    
    return `
      background: ${color};
      box-shadow: inset 2px 2px 4px ${color}BF, 
                  inset -2px -2px 4px ${color}FF;
    `;
  }};
`;

const ViewSales = () => {
  return (
    <ViewSalesContainer>
      <SummaryContainer>
        <SummaryCard>
          <CardTitle>Total Revenue</CardTitle>
          <CardValue>₱{salesSummary.totalRevenue.toLocaleString()}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>Total Orders</CardTitle>
          <CardValue>{salesSummary.totalOrders}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardTitle>Average Order Value</CardTitle>
          <CardValue>₱{salesSummary.averageOrderValue.toFixed(2)}</CardValue>
        </SummaryCard>
      </SummaryContainer>

      <TableContainer>
        <TableTitle>Recent Transactions</TableTitle>
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map(tx => (
              <tr key={tx.id}>
                <Td>{tx.id}</Td>
                <Td>{tx.customer}</Td>
                <Td>{tx.date}</Td>
                <Td>₱{tx.amount.toFixed(2)}</Td>
                <Td><StatusBadge status={tx.status}>{tx.status}</StatusBadge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </ViewSalesContainer>
  );
};

export default ViewSales;
