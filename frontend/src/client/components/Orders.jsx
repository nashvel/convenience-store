import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBox, FaCreditCard, FaMapMarkerAlt, FaMotorcycle, FaCheck, FaTimes } from 'react-icons/fa';

const OrdersContainer = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.body};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 30px;
`;

const OrderList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
`;

const OrderCard = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardHeader = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const RiderSelect = styled.select`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.shadows.dark};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  outline: none;
  width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  ${({ theme, accept }) => (accept ? theme.neumorphism(false, '10px') : theme.neumorphism(false, '10px'))};
  flex-grow: 1;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${({ accept, theme }) => (accept ? theme.accent : theme.error)};

  &:hover {
    color: white;
    background: ${({ accept, theme }) => (accept ? theme.accent : theme.error)};
  }

  &:active {
    ${({ theme }) => theme.neumorphismPressed('10px')};
  }
`;

const mockOrders = [
  {
    id: 'ORD-12345',
    customer: 'John Doe',
    product: 'Neumorphic Smart Watch',
    payment: 'Credit Card',
    address: '123 Tech Lane, Silicon Valley, CA',
  },
  {
    id: 'ORD-12346',
    customer: 'Jane Smith',
    product: 'Minimalist Desk Lamp',
    payment: 'PayPal',
    address: '456 Design Ave, San Francisco, CA',
  },
  {
    id: 'ORD-12347',
    customer: 'Peter Jones',
    product: 'Floating Bookshelf',
    payment: 'Stripe',
    address: '789 Innovation Rd, Austin, TX',
  },
];

const mockRiders = ['Rider A', 'Rider B', 'Rider C'];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);

  const handleDecline = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleAccept = (orderId) => {
    // Here you would typically update the order status
    console.log(`Order ${orderId} accepted.`);
  };

  return (
    <OrdersContainer>
      <Title>Incoming Orders</Title>
      <OrderList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <CardHeader>{order.id} - {order.customer}</CardHeader>
            <InfoSection>
              <InfoItem><FaBox /> {order.product}</InfoItem>
              <InfoItem><FaCreditCard /> {order.payment}</InfoItem>
              <InfoItem><FaMapMarkerAlt /> {order.address}</InfoItem>
              <InfoItem>
                <FaMotorcycle />
                <RiderSelect>
                  <option value="">Select a Rider</option>
                  {mockRiders.map(rider => <option key={rider} value={rider}>{rider}</option>)}
                </RiderSelect>
              </InfoItem>
            </InfoSection>
            <ActionButtons>
              <ActionButton accept onClick={() => handleAccept(order.id)}><FaCheck /> Accept</ActionButton>
              <ActionButton onClick={() => handleDecline(order.id)}><FaTimes /> Decline</ActionButton>
            </ActionButtons>
          </OrderCard>
        ))}
      </OrderList>
    </OrdersContainer>
  );
};

export default Orders;
