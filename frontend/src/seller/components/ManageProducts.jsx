import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaMinus, FaEllipsisV, FaStar } from 'react-icons/fa';
import ProductReviewsModal from './ProductReviewsModal';
import { fetchAllProducts } from '../../api/productApi';
import Loading from './Loading';

// Expanded Mock Data


// Styled Components
const Container = styled.div` padding: 40px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; `;
const Title = styled.h1` font-size: 2rem; color: ${({ theme }) => theme.text}; margin: 0; `;
const ViewOptions = styled.div` display: flex; align-items: center; gap: 15px; label { color: ${({ theme }) => theme.textSecondary}; font-weight: 600; } `;
const SizeSlider = styled.input`
  -webkit-appearance: none; width: 150px; height: 8px; border-radius: 5px; background: ${({ theme }) => theme.shadows.dark}; outline: none;
  &::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${({ theme }) => theme.primary}; cursor: pointer; ${({ theme }) => theme.neumorphism(false, '50%')}; }
  &::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: ${({ theme }) => theme.primary}; cursor: pointer; ${({ theme }) => theme.neumorphism(false, '50%')}; }
`;
const ProductGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(${({ size }) => size}px, 1fr)); gap: 30px; `;
const ProductCard = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')}; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; position: relative;
`;
const ProductImage = styled.img` width: 100%; height: 160px; object-fit: cover; `;
const ProductInfo = styled.div` padding: 20px; display: flex; flex-direction: column; gap: 10px; flex-grow: 1; `;
const ProductName = styled.h3` font-size: 1.2rem; color: ${({ theme }) => theme.text}; margin: 0; `;
const ProductPrice = styled.p` font-size: 1.1rem; font-weight: 600; color: ${({ theme }) => theme.primary}; margin: 0; `;
const CardFooter = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 0 20px 20px; `;
const StockControl = styled.div` display: flex; align-items: center; gap: 10px; `;
const StockButton = styled.button`
  ${({ theme }) => theme.neumorphism(false, '50%')}; width: 30px; height: 30px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: ${({ theme }) => theme.textSecondary}; font-size: 1rem;
  &:active { ${({ theme }) => theme.neumorphism(true, '50%')}; }
`;
const StockDisplay = styled.span` font-size: 1.1rem; font-weight: 600; color: ${({ theme }) => theme.text}; `;
const OptionsButton = styled(StockButton)` position: relative; `;
const DropdownMenu = styled.div`
  ${({ theme }) => theme.neumorphism(false, '10px')}; position: absolute; bottom: 60px; right: 20px; background: ${({ theme }) => theme.body};
  border-radius: 10px; z-index: 10; overflow: hidden; width: 120px;
`;
const DropdownItem = styled.button`
  background: transparent; border: none; padding: 12px 15px; width: 100%; text-align: left; cursor: pointer; color: ${({ theme }) => theme.textSecondary};
  display: flex; align-items: center; gap: 10px;
  &:hover { background: ${({ theme }) => theme.shadows.dark}; color: ${({ theme, color }) => color || theme.primary}; }
`;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardSize, setCardSize] = useState(280);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewingReviewsFor, setViewingReviewsFor] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchAllProducts();
        setProducts(fetchedProducts.map(p => ({ ...p, imageUrl: p.image }))); // Adapt image property
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleStockChange = (id, amount) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p));
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setOpenMenuId(null);
  };

    if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header>
        <Title>Manage Products</Title>
        <ViewOptions>
          <label htmlFor="size-slider">View Size</label>
          <SizeSlider id="size-slider" type="range" min="240" max="400" value={cardSize} onChange={(e) => setCardSize(e.target.value)} />
        </ViewOptions>
      </Header>
      <ProductGrid size={cardSize}>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
            </ProductInfo>
            <CardFooter>
              <StockControl>
                <StockButton onClick={() => handleStockChange(product.id, -1)}><FaMinus /></StockButton>
                <StockDisplay>{product.stock}</StockDisplay>
                <StockButton onClick={() => handleStockChange(product.id, 1)}><FaPlus /></StockButton>
              </StockControl>
              <OptionsButton onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}>
                <FaEllipsisV />
              </OptionsButton>
            </CardFooter>
            {openMenuId === product.id && (
              <DropdownMenu>
                <DropdownItem><FaEdit /> Edit</DropdownItem>
                <DropdownItem color="#FF5722" onClick={() => handleDelete(product.id)}><FaTrash /> Delete</DropdownItem>
                <DropdownItem onClick={() => { setViewingReviewsFor(product); setOpenMenuId(null); }}>
                  <FaStar /> View Reviews
                </DropdownItem>
              </DropdownMenu>
            )}
          </ProductCard>
        ))}
      </ProductGrid>
      {viewingReviewsFor && 
        <ProductReviewsModal 
          product={viewingReviewsFor} 
          onClose={() => setViewingReviewsFor(null)} 
        />
      }
    </Container>
  );
};

export default ManageProducts;
