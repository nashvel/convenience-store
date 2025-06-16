import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { ProductContext } from '../../context/ProductContext';
import { StoreContext } from '../../context/StoreContext';
import { CartContext } from '../../context/CartContext';
import Reviews from '../../components/Reviews';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { products, loading, error, isFavorite, toggleFavorite } = useContext(ProductContext);
  const { stores } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1);

  const product = !loading && products.length > 0 ? products.find(p => String(p.id) === id) : null;
  const store = product ? stores.find(s => s.id === product.storeId) : null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <ProductDetailsContainer><h2>Loading...</h2></ProductDetailsContainer>;
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>{error}</h2>
        <BackButton to="/products">Back to Products</BackButton>
      </ErrorContainer>
    );
  }

  if (!product) {
    return (
      <ErrorContainer>
        <h2>Product not found</h2>
        <BackButton to="/products">Back to Products</BackButton>
      </ErrorContainer>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <ProductDetailsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackLink to="/products">
        <FaArrowLeft /> Back to Products
      </BackLink>
      
      <ProductContent>
        <ProductImageSection>
          <ProductImage src={product.image} alt={product.name} />
          <FavoriteButton 
            onClick={() => toggleFavorite(product.id)}
            $isFavorite={favorite}
          >
            {favorite ? <FaHeart /> : <FaRegHeart />}
          </FavoriteButton>
        </ProductImageSection>
        
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductTitle>{product.name}</ProductTitle>
          {store && (
            <StoreInfo to={`/stores/${store.id}`}>
              Sold by {store.name}
            </StoreInfo>
          )}
          
          <PriceContainer>
            <CurrentPrice>
              ₱{product && product.price ? product.price.toFixed(2) : '0.00'}
            </CurrentPrice>
          </PriceContainer>
          
          <RatingContainer>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} $filled={i < Math.floor(product.rating)}>
                <FaStar />
              </StarIcon>
            ))}
            <RatingText>({product && product.rating ? product.rating.toFixed(1) : '0.0'})</RatingText>
          </RatingContainer>
          
          <Divider />
          
          <ProductDescription>{product.description}</ProductDescription>
          
          {product.inStock ? (
            <StockInfo $inStock={true}>In Stock</StockInfo>
          ) : (
            <StockInfo $inStock={false}>Out of Stock</StockInfo>
          )}
          
          <AddToCartSection>
            <QuantityControl>
              <QuantityButton 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </QuantityButton>
              <QuantityInput 
                type="number" 
                min="1" 
                value={quantity}
                onChange={handleQuantityChange}
              />
              <QuantityButton onClick={() => setQuantity(quantity + 1)}>
                +
              </QuantityButton>
            </QuantityControl>
            
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FaShoppingCart /> Add to Cart
            </AddToCartButton>
          </AddToCartSection>
          
          <ProductMeta>
            <MetaItem>
              <MetaLabel>SKU:</MetaLabel>
              <MetaValue>{product.sku || `SKU-${product.id}`}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Category:</MetaLabel>
              <MetaValue>{product.category}</MetaValue>
            </MetaItem>
          </ProductMeta>
        </ProductInfo>
      </ProductContent>
      
      <Reviews />
    </ProductDetailsContainer>
  );
};

const ProductDetailsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
  
  @media (max-width: 768px) {
    padding: 70px 15px 30px;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: ${({ theme }) => theme.error};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 992px) {
    gap: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageSection = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  aspect-ratio: 1 / 1;
  display: block;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  svg {
    font-size: 1.2rem;
    color: ${props => props.$isFavorite ? props.theme.error : props.theme.textSecondary};
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StoreInfo = styled(Link)`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;
  margin-bottom: 15px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.primary};
  }
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const OriginalPrice = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: line-through;
`;

const DiscountBadge = styled.div`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
`;

const StarIcon = styled.span`
  color: ${props => props.$filled ? props.theme.accent : props.theme.border};
  font-size: 1.2rem;
`;

const RatingText = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  margin-left: 5px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin: 20px 0;
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  margin-bottom: 20px;
`;

const StockInfo = styled.div`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 20px;
  background-color: ${props => props.$inStock ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  color: ${props => props.$inStock ? '#2ecc71' : '#e74c3c'};
`;

const AddToCartSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.cardBg};
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.border};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 40px;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.inputBg};
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  height: 40px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MetaItem = styled.div`
  display: flex;
  gap: 10px;
`;

const MetaLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  width: 60px;
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.text};
`;



export default ProductDetails;