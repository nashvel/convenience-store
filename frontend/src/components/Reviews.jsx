import React, { useState } from 'react';

import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';



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
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-5">Customer Reviews</h2>
      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-200 py-5 last:border-b-0">
          <div className="flex items-center mb-2.5">
            <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full mr-4" />
            <div className="font-semibold text-gray-800">{review.author}</div>
            <div className="flex items-center ml-auto text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="mr-1" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>
          <div className="flex items-center gap-5 text-gray-500">
            <button 
              onClick={() => handleAction(review.id, 'like')}
              className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ease-in-out hover:text-blue-600 ${userActions[review.id] === 'like' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <FaThumbsUp /> {review.likes}
            </button>
            <button 
              onClick={() => handleAction(review.id, 'dislike')}
              className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ease-in-out hover:text-red-600 ${userActions[review.id] === 'dislike' ? 'text-red-600' : 'text-gray-500'}`}
            >
              <FaThumbsDown /> {review.dislikes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
