import React, { useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { LOGO_ASSET_URL } from '../../config';

const StorePage = () => {
  const { storeId } = useParams();
  const { stores, allProducts: products, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('best-sellers');

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

    const sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'best-sellers':
      default:
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return sorted;
  }, [products, storeId, searchQuery, sortOption]);

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
      <StoreHeader logoUrl={store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : ''}>
        <StoreName>{store.name}</StoreName>
        <StoreDescription>{store.description}</StoreDescription>
      </StoreHeader>
      
      <SectionTitle>Products from this store</SectionTitle>

      <ToolbarContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search products in this store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon><FaSearch /></SearchIcon>
        </SearchContainer>
        <SortContainer>
          <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="best-sellers">Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </SortSelect>
        </SortContainer>
      </ToolbarContainer>
      
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
  position: relative;
  text-align: center;
  margin-bottom: 40px;
  padding: 60px 30px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ logoUrl }) => (logoUrl ? `url(${logoUrl})` : 'none')};
    background-size: cover;
    background-position: center;
    filter: blur(5px) brightness(0.6);
    transform: scale(1.1);
    z-index: -1;
  }
`;

const StoreName = styled.h1`
  font-size: 3rem;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  position: relative;
`;

const StoreDescription = styled.p`
  font-size: 1.2rem;
  color: #f0f0f0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  position: relative;
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

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SortSelect = styled.select`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
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
