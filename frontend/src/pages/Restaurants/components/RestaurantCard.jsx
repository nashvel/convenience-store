import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaHeart } from 'react-icons/fa';

const RestaurantCard = ({ 
  restaurant, 
  onViewMenu, 
  onToggleFavorite, 
  isFavorite = false 
}) => {
  const isUnavailable = !restaurant.isOpen;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group ${isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !isUnavailable && onViewMenu(restaurant)}
    >
      <div className="relative">
        <img 
          src={restaurant.logo || 'https://via.placeholder.com/400x225'}
          alt={restaurant.name}
          className={`w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105 ${isUnavailable ? 'filter grayscale' : ''}`}
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Temporarily unavailable</span>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onToggleFavorite(restaurant.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-red-100'}`}
        >
          <FaHeart size={16} />
        </motion.button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">
          {restaurant.cuisine || 'Variety of dishes'}
        </p>
        <div className="flex items-center text-sm text-gray-600">
          {typeof restaurant.rating === 'number' && restaurant.rating > 0 ? (
            <>
              <FaStar className="text-yellow-400 mr-1" />
              <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
            </>
          ) : (
            <>
              <FaStar className="text-gray-400 mr-1" />
              <span className="font-semibold">New</span>
            </>
          )}
          <span className="mx-2">·</span>
          <span>{restaurant.deliveryTime ? `${restaurant.deliveryTime} min` : 'N/A'}</span>
          <span className="mx-2">·</span>
          <span>
            {typeof restaurant.deliveryFee === 'number'
              ? (restaurant.deliveryFee === 0 ? 'Free Delivery' : `₱${restaurant.deliveryFee.toFixed(2)}`)
              : 'Fee N/A'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
