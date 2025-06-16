import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StoreContext } from '../../context/StoreContext';
import { motion } from 'framer-motion';


const Stores = () => {
  const { stores, loading, error } = useContext(StoreContext);

  if (loading) return <PageContainer>Loading stores...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Our Stores</Title>
      <StoreGrid>
        {stores.map(store => (
          <StoreCard key={store.id} to={`/stores/${store.id}`}>
            <StoreLogo src={store.logo} alt={`${store.name} logo`} />
            <StoreContent>
              <StoreName>{store.name}</StoreName>
              <StoreDescription>{store.description}</StoreDescription>
              <StoreLocation>{store.location}</StoreLocation>
            </StoreContent>
          </StoreCard>
        ))}
      </StoreGrid>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const StoreCard = styled(Link)`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 15px;
  text-decoration: none;
  color: inherit;
  box-shadow: ${({ theme }) => theme.cardShadow};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
`;

const StoreLogo = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 15px;
  border-radius: 4px;
`;

const StoreContent = styled.div`
  padding: 15px;
`;

const StoreName = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
`;



const StoreDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 10px;
`;

const StoreLocation = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 10px;
`;

export default Stores;
