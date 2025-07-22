import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FavoriteCuisines = ({ categories, onSelectCategory, selectedCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Mock images for categories - replace with actual images if available
  const categoryImages = {
    Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop',
    Burgers: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=120&h=120&fit=crop',
    Asian: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&h=120&fit=crop',
    Healthy: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop',
    Desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&h=120&fit=crop',
    Coffee: 'https://images.unsplash.com/photo-1511920183353-3c7c95a5742c?w=120&h=120&fit=crop',
    'Fast Food': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=120&h=120&fit=crop',
    Seafood: 'https://images.unsplash.com/photo-1559737558-2f5a35d47322?w=120&h=120&fit=crop',
    All: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
  };

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex items-center space-x-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {categories.map((category) => (
          <motion.div
            key={category.name}
            className="flex-shrink-0 text-center cursor-pointer group w-24"
            onClick={() => onSelectCategory(category.name)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className={`w-24 h-24 rounded-full mb-2 overflow-hidden flex items-center justify-center transition-all duration-300 shadow-md ${selectedCategory === category.name ? 'border-4 border-orange-500' : 'border-2 border-transparent'}`}>
              <img src={categoryImages[category.name]} alt={category.name} className="w-full h-full object-cover" />
            </div>
            <p className={`text-sm font-semibold transition-colors duration-300 ${selectedCategory === category.name ? 'text-orange-600' : 'text-gray-700 group-hover:text-orange-500'}`}>
              {category.name}
            </p>
          </motion.div>
        ))}
      </div>
      <button 
        onClick={() => scroll('left')} 
        className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>
      <button 
        onClick={() => scroll('right')} 
        className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default FavoriteCuisines;
