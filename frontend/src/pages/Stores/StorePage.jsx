import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';

const StorePage = () => {
  const { storeId } = useParams();
  const { stores, products, loading, error } = useContext(StoreContext);

  const store = useMemo(() => stores.find(s => s.id === storeId), [stores, storeId]);
  const storeProducts = useMemo(() => products.filter(p => p.storeId === storeId), [products, storeId]);

  if (loading) return <PageContainer>Loading store...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;
  if (!store) return <PageContainer>Store not found.</PageContainer>;

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StoreHeader>
        <StoreName>{store.name}</StoreName>
        <StoreDescription>{store.description}</StoreDescription>
      </StoreHeader>
      
      <SectionTitle>Products from this store</SectionTitle>
      
      <ProductsGrid>
        {storeProducts.length > 0 ? (
          storeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>This store has no products yet.</p>
        )}
      </ProductsGrid>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
`;

const StoreHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
`;

const StoreName = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
`;

const StoreDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  padding-bottom: 10px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
`;

export default StorePage;
