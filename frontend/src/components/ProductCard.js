import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <CardContainer 
      to={`/product/${product.id}`}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        <ProductImage src={product.image} alt={product.name} />
        {product.inStock ? (
          <AddToCartButton 
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShoppingCart />
          </AddToCartButton>
        ) : (
          <OutOfStockBadge>Out of Stock</OutOfStockBadge>
        )}
      </ImageContainer>
      
      <CardContent>
        <ProductName>{product.name}</ProductName>
        
        <PriceRatingContainer>
          <Price>${product.price.toFixed(2)}</Price>
          <Rating>
            <FaStar /> {product.rating}
          </Rating>
        </PriceRatingContainer>
        
        <CategoryBadge>{product.category}</CategoryBadge>
      </CardContent>
    </CardContainer>
  );
};

const CardContainer = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.cardShadow};
  height: 100%;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const AddToCartButton = styled(motion.button)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.error};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const PriceRatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Price = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.primary};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textSecondary};
  
  svg {
    color: #FFC107;
  }
`;

const CategoryBadge = styled.span`
  background-color: ${({ theme }) => theme.secondary};
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  align-self: flex-start;
  margin-top: auto;
`;

export default ProductCard;