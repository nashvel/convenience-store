import React from 'react';
import styled from 'styled-components';

const OrdersContainer = styled.div`
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

const OrderList = styled.div`
  text-align: left;
`;

const OrderItem = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const MyOrders = () => {
  // Placeholder data
  const orders = [
    {
      id: 'ORD12345',
      date: '2025-06-15',
      total: '₱1,250.00',
      status: 'Delivered',
    },
    {
      id: 'ORD12346',
      date: '2025-06-16',
      total: '₱875.50',
      status: 'Processing',
    },
  ];

  return (
    <OrdersContainer>
      <Title>My Orders</Title>
      <OrderList>
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderItem key={order.id}>
              <OrderHeader>
                <span>Order ID: {order.id}</span>
                <span>Status: {order.status}</span>
              </OrderHeader>
              <div>Date: {order.date}</div>
              <div>Total: {order.total}</div>
            </OrderItem>
          ))
        ) : (
          <p>You have no orders yet.</p>
        )}
      </OrderList>
    </OrdersContainer>
  );
};

export default MyOrders;
