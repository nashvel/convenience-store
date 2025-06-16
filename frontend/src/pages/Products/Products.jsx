import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ProductContext } from '../../context/ProductContext';
import ProductCard from '../../components/ProductCard';
import { FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Products = () => {
  const location = useLocation();
  const { products, categories, loading, error } = useContext(ProductContext);
  
  // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const dealsParam = queryParams.get('deals') === 'true';
  
  // State for filters and sorting
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Apply filters and sorting
  useEffect(() => {
    if (loading || error) return;
    
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Filter by deals
    if (dealsParam) {
      result = result.filter(product => product.discount > 0);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price':
        result.sort((a, b) => sortDirection === 'asc' ? a.price - b.price : b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        });
        break;
      case 'popularity':
      default:
        result.sort((a, b) => sortDirection === 'asc' ? a.popularity - b.popularity : b.popularity - a.popularity);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, priceRange, sortOption, sortDirection, dealsParam, loading, error]);

  // Handle price range change
  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value);
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <LoadingContainer>Loading products...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <ProductsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <PageTitle>All Products</PageTitle>
        <MobileFilterToggle onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </MobileFilterToggle>
      </PageHeader>

      <ProductsLayout>
        <FiltersPanel $show={showFilters}>
          <FilterSection>
            <FilterTitle>Categories</FilterTitle>
            <CategoryList>
              <CategoryItem 
                $active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </CategoryItem>
              {categories.map(category => (
                <CategoryItem 
                  key={category.id}
                  $active={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </CategoryItem>
              ))}
            </CategoryList>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRangeContainer>
              <PriceInput>
                <label>Min:</label>
                <input 
                  type="number" 
                  min="0" 
                  max={priceRange.max} 
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                />
              </PriceInput>
              <PriceInput>
                <label>Max:</label>
                <input 
                  type="number" 
                  min={priceRange.min} 
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                />
              </PriceInput>
            </PriceRangeContainer>
          </FilterSection>
        </FiltersPanel>

        <ProductsContent>
          <ProductsToolbar>
            <SearchContainer>
              <SearchInput 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon><FaSearch /></SearchIcon>
            </SearchContainer>
            
            <SortContainer>
              <SortSelect 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </SortSelect>
              <SortDirectionButton onClick={toggleSortDirection}>
                {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </SortDirectionButton>
            </SortContainer>
          </ProductsToolbar>

          {filteredProducts.length === 0 ? (
            <NoProductsMessage>
              No products found matching your criteria. Try adjusting your filters.
            </NoProductsMessage>
          ) : (
            <>
              <ProductCount>{filteredProducts.length} products found</ProductCount>
              <ProductsGrid>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductsGrid>
            </>
          )}
        </ProductsContent>
      </ProductsLayout>
    </ProductsContainer>
  );
};

const ProductsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
  
  @media (max-width: 768px) {
    padding: 70px 15px 30px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.error};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const MobileFilterToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ProductsLayout = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FiltersPanel = styled.aside`
  width: 250px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.$show ? 'block' : 'none'};
    margin-bottom: 20px;
  }
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.text};
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  padding: 8px 0;
  cursor: pointer;
  color: ${props => props.$active ? props.theme.primary : props.theme.text};
  font-weight: ${props => props.$active ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriceInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  label {
    width: 40px;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  input {
    flex: 1;
    padding: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 4px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
  }
`;

const ProductsContent = styled.div`
  flex: 1;
`;

const ProductsToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
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
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SortDirectionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const ProductCount = styled.div`
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
`;

const NoProductsMessage = styled.div`
  padding: 40px 0;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
`;

export default Products;