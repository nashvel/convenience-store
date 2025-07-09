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
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="flex items-start">
            <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full mr-4 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-gray-800 text-sm">{review.author}</div>
                <div className="flex items-center text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-4 text-gray-500 mt-2">
                <button 
                  onClick={() => handleAction(review.id, 'like')}
                  className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ease-in-out hover:text-blue-600 ${userActions[review.id] === 'like' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  <FaThumbsUp /> {review.likes}
                </button>
                <button 
                  onClick={() => handleAction(review.id, 'dislike')}
                  className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ease-in-out hover:text-red-600 ${userActions[review.id] === 'dislike' ? 'text-red-600' : 'text-gray-500'}`}
                >
                  <FaThumbsDown /> {review.dislikes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
