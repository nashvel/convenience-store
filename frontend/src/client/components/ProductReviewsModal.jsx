import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchReviewsByProductId } from '../../api/productApi';
import Loading from './Loading';
import { FaStar, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  ${({ theme }) => theme.neumorphism(false, '20px')};
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  background: ${({ theme }) => theme.body};
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.text};
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.5rem;
  ${({ theme }) => theme.neumorphism(false, '50%')};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    ${({ theme }) => theme.neumorphism(true, '50%')};
  }
`;

const ReviewsList = styled.div`
  overflow-y: auto;
  padding-right: 10px; // for scrollbar
`;

const ReviewCard = styled.div`
  ${({ theme }) => theme.neumorphism(true, '15px')};
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
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

const RatingContainer = styled.div`
  display: flex;
  gap: 5px;
  color: #f1c40f;
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

const StarRating = ({ rating }) => (
  <RatingContainer>
    {[...Array(5)].map((_, i) => <FaStar key={i} color={i < rating ? '#f1c40f' : '#e0e0e0'} />)}
  </RatingContainer>
);

const ProductReviewsModal = ({ product, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
            const data = await fetchReviewsByProductId(product.id);
      setReviews(data.reviews);
      setLoading(false);
    };
    getReviews();
  }, [product.id]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Reviews for {product.name}</h3>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </ModalHeader>
        <ReviewsList>
          {loading ? (
            <Loading />
          ) : reviews.length > 0 ? (
            reviews.map(review => (
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
            ))
          ) : (
            <p>No reviews for this product yet.</p>
          )}
        </ReviewsList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductReviewsModal;
