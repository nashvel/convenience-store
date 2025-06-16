import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { fetchAllProducts, fetchAllReviews } from '../../api/productApi';
import Loading from './Loading';

// Styled Components
const ReviewsContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 30px;
`;

const ReviewCard = styled.div`
  ${({ theme }) => theme.neumorphism(false, '15px')};
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CustomerName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ProductName = styled.p`
  margin: 0;
  font-style: italic;
  color: ${({ theme }) => theme.textSecondary};
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 5px;
  color: #f1c40f; // Gold color for stars
`;

const Comment = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`;

const DateText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  align-self: flex-end;
`;

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#f1c40f" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} color="#f1c40f" />);
    } else {
      stars.push(<FaStar key={i} color="#e0e0e0" />);
    }
  }
  return <RatingContainer>{stars}</RatingContainer>;
};

const ProductSection = styled.div`
  margin-bottom: 40px;
`;

const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.shadows.dark};
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
`;

const ProductNameLarge = styled.h3`
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const Reviews = () => {
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState([]);

    useEffect(() => {
    const getProductReviews = async () => {
      try {
        const [products, reviews] = await Promise.all([
          fetchAllProducts(),
          fetchAllReviews(),
        ]);

        const reviewsByProduct = products.map(product => {
          const productReviews = reviews.filter(review => review.productId === product.id);
          const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
          const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
          return {
            ...product,
            reviews: productReviews,
            averageRating,
            reviewCount: productReviews.length,
          };
        });

        setProductReviews(reviewsByProduct);
      } catch (error) {
        console.error("Failed to fetch product reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    getProductReviews();
  }, []);

  const toggleExpanded = (productId) => {
    setExpandedProducts(currentExpanded =>
      currentExpanded.includes(productId)
        ? currentExpanded.filter(id => id !== productId)
        : [...currentExpanded, productId]
    );
  };

    if (loading) {
    return <Loading />;
  }

    return (
    <ReviewsContainer>
      <Title>Product Reviews</Title>
      {productReviews.map(product => (
        product.reviews.length > 0 && (
          <ProductSection key={product.id}>
            <ProductHeader>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductNameLarge>{product.name}</ProductNameLarge>
                {product.reviewCount > 0 && (
                  <RatingSummary>
                    <StarRating rating={product.averageRating} />
                    <strong>{product.averageRating.toFixed(1)}</strong>
                    <span>({product.reviewCount} reviews)</span>
                  </RatingSummary>
                )}
              </ProductInfo>
            </ProductHeader>
            {(expandedProducts.includes(product.id) ? product.reviews : product.reviews.slice(0, 1)).map(review => (
              <ReviewCard key={review.id}>
                <Avatar src={review.avatar} alt={review.customerName} />
                <ReviewContent>
                  <ReviewHeader>
                    <CustomerName>{review.customerName}</CustomerName>
                    <StarRating rating={review.rating} />
                  </ReviewHeader>
                  <Comment>{review.comment}</Comment>
                  <DateText>{review.date}</DateText>
                </ReviewContent>
              </ReviewCard>
            ))}
            {product.reviews.length > 1 && (
              <ViewAllButton onClick={() => toggleExpanded(product.id)}>
                {expandedProducts.includes(product.id) ? 'Show Less' : `View All ${product.reviews.length} Reviews`}
              </ViewAllButton>
            )}
          </ProductSection>
        )
      ))}
    </ReviewsContainer>
  );
};

export default Reviews;

