import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { fetchAllProducts, fetchAllReviews } from '../../../api/productApi';
import Loading from '../animation/Loading';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

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
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Product Reviews</h2>
      {productReviews.map(product => (
        product.reviews.length > 0 && (
          <div key={product.id} className="mb-10">
            <div className="flex items-center gap-5 mb-5 pb-5 border-b border-gray-200">
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <StarRating rating={product.averageRating} />
                    <strong className="text-gray-800">{product.averageRating.toFixed(1)}</strong>
                    <span>({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {(expandedProducts.includes(product.id) ? product.reviews : product.reviews.slice(0, 1)).map(review => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm p-5 flex gap-5">
                  <img src={review.avatar} alt={review.customerName} className="w-14 h-14 rounded-full" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-800">{review.customerName}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    <span className="text-xs text-gray-400 mt-2 text-right block">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {product.reviews.length > 1 && (
              <button onClick={() => toggleExpanded(product.id)} className="mt-4 text-primary font-semibold hover:underline">
                {expandedProducts.includes(product.id) ? 'Show Less' : `View All ${product.reviews.length} Reviews`}
              </button>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default Reviews;
