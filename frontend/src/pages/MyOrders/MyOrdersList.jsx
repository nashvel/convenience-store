import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const MyOrdersList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/orders?userId=${user.id}`);
                if (response.data.success) {
          console.log('Orders data from API:', response.data.orders);
          setOrders(response.data.orders);
        } else {
          setError('Failed to fetch orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <OrdersContainer>
      <Title>My Orders</Title>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <OrdersTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>₱{parseFloat(order.total || 0).toFixed(2)}</td>
                <td><Status $status={order.status}>{order.status}</Status></td>
                <td>
                  <ViewButton to={`/my-orders/${order.id}`}>View Details</ViewButton>
                </td>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
      )}
    </OrdersContainer>
  );
};

const OrdersContainer = styled.div`
  max-width: 1000px;
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

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  th {
    font-weight: 600;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Status = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  color: #fff;
  font-size: 0.8rem;
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

const ViewButton = styled(Link)`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export default MyOrdersList;
