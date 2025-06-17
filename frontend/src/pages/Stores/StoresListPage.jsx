import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { LOGO_ASSET_URL } from '../../config';

const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);

  if (loading) {
    return <PageContainer>Loading stores...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Error: {error}</PageContainer>;
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle>All Stores</PageTitle>
      <StoreGrid>
        {stores.map((store) => (
          <StoreCard 
            key={store.id} 
            to={`/stores/${store.id}`}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <StoreLogo src={`${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} />
            <StoreName>{store.name}</StoreName>
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

const PageTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.primary};
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
`;

const StoreCard = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.cardShadow};
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StoreLogo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 15px;
`;

const StoreName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export default StoresListPage;
