import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_ASSET_URL } from '../../config';

const MyOrders = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to fetch order details.');
        }
      } catch (err) {
        setError('An error occurred while fetching order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/orders/cancel/${id}`);
      if (response.data.success) {
        setOrder({ ...order, status: 'cancelled' });
        alert('Order cancelled successfully!');
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      alert('An error occurred while cancelling the order.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <OrderContainer>
      <BackButton to="/my-orders">← Back to Orders</BackButton>
      <Title>Order Details</Title>
      <OrderHeader>
        <h3>Order #{order.id}</h3>
        <Status $status={order.status}>{order.status}</Status>
      </OrderHeader>
      <OrderInfo>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₱{parseFloat(order.total || 0).toFixed(2)}</p>
      </OrderInfo>

      <h4>Items</h4>
      <ItemsList>
        {order.items.map(item => (
          <Item key={item.id}>
                        <ItemImage src={`${PRODUCT_ASSET_URL}/${item.image}`} alt={item.name} />
            <ItemInfo>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
                            <p>Price: ₱{parseFloat(item.price || 0).toFixed(2)}</p>
            </ItemInfo>
          </Item>
        ))}
      </ItemsList>

      {order.status === 'pending' && (
        <CancellationSection>
          <p>Order can still be cancelled if not yet shipping or accepted.</p>
          <CancelButton onClick={handleCancelOrder}>Cancel Order</CancelButton>
        </CancellationSection>
      )}
    </OrderContainer>
  );
};

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => theme.buttonSecondary};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.buttonSecondaryHover};
  }
`;

const OrderContainer = styled.div`
  max-width: 800px;
  margin: 8rem auto 2rem;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Status = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #fff;
  font-weight: 600;
  text-transform: capitalize;
    background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return theme.warning; // Orange
            case 'accepted':
        return theme.success; // Green for Accepted
      case 'shipped':
        return theme.secondary; // A neutral blue/purple
      case 'delivered':
        return theme.primary; // A darker blue
      case 'rejected':
      case 'cancelled':
        return theme.error; // Red
      default:
        return theme.textSecondary; // Grey
    }
  }};
`;

const OrderInfo = styled.div`
  margin-bottom: 2rem;
`;

const ItemsList = styled.div`
  margin-bottom: 2rem;
`;

const Item = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 1rem;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ItemInfo = styled.div``;

const CancellationSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  text-align: center;
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.error};
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export default MyOrders;
