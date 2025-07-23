import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCT_ASSET_URL } from '../../../config';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AddOnsModal from './AddOnsModal';

const ITEMS_PER_PAGE = 8;

const FoodItemCard = ({ food, restaurants, handleViewMenu, handleAddToCart, onShowAddOns }) => (
  <motion.div
    key={`${food.restaurantId}-${food.id}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
    onClick={() => {
      const restaurant = restaurants.find(r => r.id === food.restaurantId);
      if (restaurant) {
        handleViewMenu(restaurant);
      }
    }}
  >
    <div className="relative">
      <img
        src={food.image ? `${PRODUCT_ASSET_URL}/${food.image}` : 'https://via.placeholder.com/300x200'}
        alt={food.name}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
        {food.restaurantName}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{food.name}</h3>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{food.description || 'Delicious food item'}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">₱{parseFloat(food.price || 0).toFixed(2)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const restaurant = restaurants.find(r => r.id === food.restaurantId);
            onShowAddOns(food, restaurant);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </motion.div>
);

const DiscoverFood = ({ foodItems, loading, restaurants, handleViewMenu, handleAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const totalPages = Math.ceil(foodItems.length / ITEMS_PER_PAGE);
  const paginatedItems = foodItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover Food</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : foodItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map((food) => (
              <FoodItemCard
                key={`${food.restaurantId}-${food.id}`}
                food={food}
                restaurants={restaurants}
                handleViewMenu={handleViewMenu}
                handleAddToCart={handleAddToCart}
                onShowAddOns={(product, restaurant) => {
                  setSelectedProduct(product);
                  setSelectedRestaurant(restaurant);
                  setShowAddOnsModal(true);
                }}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft />
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No food items available at the moment.</p>
        </div>
      )}
      
      <AddOnsModal
        isOpen={showAddOnsModal}
        onClose={() => setShowAddOnsModal(false)}
        product={selectedProduct}
        restaurant={selectedRestaurant}
        onAddToCart={(cartItem) => {
          handleAddToCart(cartItem);
          setShowAddOnsModal(false);
        }}
      />
    </section>
  );
};

export default DiscoverFood;
