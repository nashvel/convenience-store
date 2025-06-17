import React, { useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const StorePage = () => {
  const { storeId } = useParams();
  const { stores, allProducts: products, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');

  const store = useMemo(() => (stores || []).find(s => s.id == storeId), [stores, storeId]);
  const storeProducts = useMemo(() => {
    let filtered = (products || []).filter(p => p.store_id == storeId);
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        (p.description && p.description.toLowerCase().includes(lowercasedQuery))
      );
    }
    return filtered;
  }, [products, storeId, searchQuery]);

  if (loading) {
    return <PageContainer>Loading store...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Error: {error}</PageContainer>;
  }

  if (!store) {
    return <PageContainer>Store not found.</PageContainer>;
  }

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

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search products in this store..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon><FaSearch /></SearchIcon>
      </SearchContainer>
      
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 25px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

export default StorePage;
