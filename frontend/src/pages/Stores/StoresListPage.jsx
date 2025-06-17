import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { LOGO_ASSET_URL } from '../../config';
import { FaSearch } from 'react-icons/fa';
import slugify from '../../utils/slugify';

const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    if (!searchQuery) {
      return stores;
    }
    return stores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

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
      <IntroText>Visit our trusted partners and discover a world of quality products.</IntroText>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for your favorite store..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon><FaSearch /></SearchIcon>
      </SearchContainer>

      {filteredStores.length > 0 ? (
        <StoreGrid>
          {filteredStores.map((store) => (
          <StoreCard 
            key={store.id} 
            to={`/stores/${store.id}/${slugify(store.name)}`}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <StoreLogo src={`${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} />
            <StoreName>{store.name}</StoreName>
          </StoreCard>
        ))}
        </StoreGrid>
      ) : (
        <NoResultsContainer>
          <NoResultsIcon>😞</NoResultsIcon>
          <NoResultsText>No stores found matching "{searchQuery}"</NoResultsText>
          <NoResultsSubText>Try a different search or check your spelling.</NoResultsSubText>
        </NoResultsContainer>
      )}
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
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};
`;

const IntroText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 40px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const NoResultsText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const NoResultsSubText = styled.p`
  font-size: 1rem;
`;

export default StoresListPage;
