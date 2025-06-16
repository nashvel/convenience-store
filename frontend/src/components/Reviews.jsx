import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const ReviewsContainer = styled.div`
  margin-top: 40px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const ReviewItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 20px 0;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const Author = styled.div`
  font-weight: 600;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  color: ${({ theme }) => theme.accent};
`;

const StarIcon = styled(FaStar)`
  margin-right: 3px;
`;

const Comment = styled.p`
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ReviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.textSecondary};
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

// Placeholder data
const initialReviews = [
  {
    id: 1,
    author: 'Nash',
    avatar: 'https://i.pravatar.cc/150?u=nash',
    rating: 5,
    comment: 'Great product! High quality and fast delivery. Would definitely recommend to others.',
    likes: 12,
    dislikes: 1,
  },
  {
    id: 2,
    author: 'Vel',
    avatar: 'https://i.pravatar.cc/150?u=vel',
    rating: 4,
    comment: 'Good value for the price. The color is slightly different from the picture, but still nice.',
    likes: 8,
    dislikes: 3,
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [userActions, setUserActions] = useState({}); // { reviewId: 'like' | 'dislike' | null }

  const handleAction = (reviewId, action) => {
    const currentUserAction = userActions[reviewId];
    
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id !== reviewId) return review;

        let { likes, dislikes } = review;

        // Reverting previous action before applying new one
        if (currentUserAction === 'like') likes--;
        if (currentUserAction === 'dislike') dislikes--;

        // Applying new action
        if (action === currentUserAction) { // User is toggling off their action
          setUserActions(prev => ({ ...prev, [reviewId]: null }));
          return { ...review, likes, dislikes };
        } else {
          if (action === 'like') likes++;
          if (action === 'dislike') dislikes++;
          setUserActions(prev => ({ ...prev, [reviewId]: action }));
          return { ...review, likes, dislikes };
        }
      })
    );
  };

  return (
    <ReviewsContainer>
      <Title>Customer Reviews</Title>
      {reviews.map(review => (
        <ReviewItem key={review.id}>
          <ReviewHeader>
            <Avatar src={review.avatar} alt={review.author} />
            <Author>{review.author}</Author>
            <Rating>
              {[...Array(review.rating)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </Rating>
          </ReviewHeader>
          <Comment>{review.comment}</Comment>
          <ReviewActions>
            <ActionButton 
              onClick={() => handleAction(review.id, 'like')}
              $active={userActions[review.id] === 'like'}
            >
              <FaThumbsUp /> {review.likes}
            </ActionButton>
            <ActionButton 
              onClick={() => handleAction(review.id, 'dislike')}
              $active={userActions[review.id] === 'dislike'}
            >
              <FaThumbsDown /> {review.dislikes}
            </ActionButton>
          </ReviewActions>
        </ReviewItem>
      ))}
    </ReviewsContainer>
  );
};

export default Reviews;
