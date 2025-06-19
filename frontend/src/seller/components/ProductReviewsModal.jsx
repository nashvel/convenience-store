import React, { useState, useEffect } from 'react';
import { fetchReviewsByProductId } from '../../api/productApi';
import Loading from './Loading';
import { FaStar, FaTimes } from 'react-icons/fa';

const StarRating = ({ rating }) => (
  <div className="flex gap-1 text-yellow-400">
    {[...Array(5)].map((_, i) => <FaStar key={i} color={i < rating ? 'currentColor' : '#e0e0e0'} />)}
  </div>
);

const ProductReviewsModal = ({ product, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchReviewsByProductId(product.id);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    getReviews();
  }, [product.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Reviews for {product.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-2 space-y-4">
          {loading ? (
            <Loading />
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-5 flex gap-4">
                <img src={review.avatar} alt={review.customerName} className="w-12 h-12 rounded-full" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">{review.customerName}</h4>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  <span className="text-xs text-gray-400 mt-2 text-right block">{review.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No reviews for this product yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsModal;
