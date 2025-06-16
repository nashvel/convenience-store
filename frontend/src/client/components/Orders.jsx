import React, { useState } from 'react';
import styled from 'styled-components';

import { FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaMotorcycle, FaCheck, FaTimes, FaTags, FaRulerCombined } from 'react-icons/fa';

const OrdersContainer = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.body};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const TabButton = styled.button`
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme, $isActive }) => ($isActive ? 'white' : theme.textSecondary)};
  ${({ theme, $isActive }) => ($isActive ? theme.neumorphismActive(theme.primary, '15px') : theme.neumorphism(false, '15px'))};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme, $isActive }) => !$isActive && theme.primary};
  }
`;

const StickyNote = styled.div`
  ${({ theme }) => theme.neumorphism(true, '15px')};
  background: #fffde7; /* A light yellow, like a real sticky note */
  color: #5d4037; /* A brownish text color */
  padding: 20px;
  margin-bottom: 25px;
  font-weight: 600;
  border-left: 5px solid #f9a825; /* A darker yellow accent */
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

const ProductInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 15px;
  object-fit: cover;
  ${({ theme }) => theme.neumorphismPressed('15px')};
  padding: 5px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
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
    customer: 'Jay Nashvel',
    product: {
      name: 'Wireless Mouse',
      category: 'Electronics',
      imageUrl: '/assets/products/mouse.png',
      quantity: 1,
      size: '44mm',
    },
    payment: 'Credit Card',
    address: 'Crossing Libona Bukidnon',
  },
  {
    id: 'ORD-12346',
    customer: 'Ann Angel',
    product: {
      name: 'Umbrella',
      category: 'Home Decor',
      imageUrl: '/assets/products/candles.png',
      quantity: 2,
      size: 'Medium',
    },
    payment: 'PayPal',
    address: 'Crossing Libona Bukidnon',
  },
  {
    id: 'ORD-12347',
    customer: 'Kutchiki Byakuya',
    product: {
      name: 'Scented Candles',
      category: 'Furniture',
      imageUrl: '/assets/products/umbrella.png',
      quantity: 1,
      size: '3-Tier',
    },
    payment: 'Stripe',
    address: '789 Innovation Rd, Austin, TX',
  },
];

const mockRiders = ['Rider A', 'Rider B', 'Rider C'];

const Orders = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingOrders, setIncomingOrders] = useState(mockOrders);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const handleDecline = (orderId) => {
    setIncomingOrders(incomingOrders.filter(order => order.id !== orderId));
  };

  const handleAccept = (orderId) => {
    const orderToAccept = incomingOrders.find(order => order.id === orderId);
    if (orderToAccept) {
      setAcceptedOrders([...acceptedOrders, orderToAccept]);
      setIncomingOrders(incomingOrders.filter(order => order.id !== orderId));
    }
  };

  return (
    <OrdersContainer>
      <Title>Orders Management</Title>
      <TabContainer>
        <TabButton $isActive={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')}>
          Incoming Orders ({incomingOrders.length})
        </TabButton>
        <TabButton $isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
          Transactions ({acceptedOrders.length})
        </TabButton>
      </TabContainer>

      {activeTab === 'incoming' && (
        <OrderList>
        {incomingOrders.map((order) => (
          <OrderCard key={order.id}>
            <CardHeader>{order.id} - {order.customer}</CardHeader>
            <ProductInfo>
              <ProductImage src={order.product.imageUrl} alt={order.product.name} />
              <ProductDetails>
                <ProductName>{order.product.name}</ProductName>
                <InfoItem><FaTags />{order.product.category}</InfoItem>
                <InfoItem><FaBoxOpen />Quantity: {order.product.quantity}</InfoItem>
                <InfoItem><FaRulerCombined />Size: {order.product.size}</InfoItem>
              </ProductDetails>
            </ProductInfo>
            <InfoSection>
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
      )}

      {activeTab === 'transactions' && (
        <div>
          <StickyNote>Orders can still be cancelled if not yet shipped.</StickyNote>
          <OrderList>
            {acceptedOrders.map((order) => (
              <OrderCard key={order.id}>
                <CardHeader>{order.id} - {order.customer}</CardHeader>
                <ProductInfo>
                  <ProductImage src={order.product.imageUrl} alt={order.product.name} />
                  <ProductDetails>
                    <ProductName>{order.product.name}</ProductName>
                    <InfoItem><FaTags />{order.product.category}</InfoItem>
                    <InfoItem><FaBoxOpen />Quantity: {order.product.quantity}</InfoItem>
                    <InfoItem><FaRulerCombined />Size: {order.product.size}</InfoItem>
                  </ProductDetails>
                </ProductInfo>
                <InfoSection>
                  <InfoItem><FaCreditCard /> {order.payment}</InfoItem>
                  <InfoItem><FaMapMarkerAlt /> {order.address}</InfoItem>
                </InfoSection>
              </OrderCard>
            ))}
          </OrderList>
        </div>
      )}
    </OrdersContainer>
  );
};

export default Orders;
