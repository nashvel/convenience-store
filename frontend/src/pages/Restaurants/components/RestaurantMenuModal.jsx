import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaClock, FaMotorcycle, FaUtensils, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { LOGO_ASSET_URL, PRODUCT_ASSET_URL } from '../../../config';
import slugify from '../../../utils/slugify';
import AddOnsModal from './AddOnsModal';

const RestaurantMenuModal = ({ 
  isOpen, 
  onClose, 
  restaurant, 
  products, 
  loading, 
  error, 
  onAddToCart, 
  onRetry 
}) => {
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  if (!isOpen || !restaurant) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="restaurant-menu-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
            >
              <FaTimes />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={restaurant.logo ? `${LOGO_ASSET_URL}/${restaurant.logo}` : '/images/cards/restaurant-placeholder.jpg'}
                alt={restaurant.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/90">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-300" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMotorcycle />
                    <span>{restaurant.deliveryFee}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    restaurant.isOpen 
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <MenuLoadingSkeleton />
            ) : error ? (
              <MenuErrorState error={error} onRetry={onRetry} restaurant={restaurant} />
            ) : products.length === 0 ? (
              <EmptyMenuState />
            ) : (
              <MenuItemsList 
                products={products} 
                restaurant={restaurant} 
                onAddToCart={onAddToCart}
                onShowAddOns={(product) => {
                  setSelectedProduct(product);
                  setShowAddOnsModal(true);
                }}
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-600">
              {products.length > 0 && (
                <span>Showing {products.length} menu items</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <Link
                to={`/stores/${restaurant.id}/${slugify(restaurant.name)}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                onClick={onClose}
              >
                <FaShoppingCart className="text-sm" />
                Visit Full Store
              </Link>
            </div>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AddOnsModal
        isOpen={showAddOnsModal}
        onClose={() => setShowAddOnsModal(false)}
        product={selectedProduct}
        restaurant={restaurant}
        onAddToCart={(cartItem) => {
          onAddToCart(cartItem);
          setShowAddOnsModal(false);
        }}
      />
    </>
  );
};

// Loading skeleton component
const MenuLoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl animate-pulse">
        <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
      </div>
    ))}
  </div>
);

// Error state component
const MenuErrorState = ({ error, onRetry, restaurant }) => (
  <div className="text-center py-12">
    <div className="text-red-500 text-6xl mb-4">
      <FaUtensils />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Menu Unavailable</h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={() => onRetry(restaurant.id)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Empty menu state component
const EmptyMenuState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">
      <FaUtensils />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Menu Items</h3>
    <p className="text-gray-600">This restaurant hasn't added any menu items yet.</p>
  </div>
);

// Menu items list component
const MenuItemsList = ({ products, restaurant, onAddToCart, onShowAddOns }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <FaUtensils className="text-blue-600" />
      Menu Items ({products.length})
    </h3>
    {products.map((product) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:shadow-md"
      >
        <img
                    src={product.image ? `${PRODUCT_ASSET_URL}/${product.image}` : '/images/cards/product-placeholder.jpg'}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description || 'Delicious food item from our kitchen'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">₱{parseFloat(product.price).toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {product.stock} available
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of stock
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShowAddOns(product)}
            disabled={product.stock <= 0 || !restaurant.isOpen}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <FaPlus className="text-xs" />
            Add to Cart
          </button>
          {!restaurant.isOpen && (
            <span className="text-xs text-red-600 text-center">Restaurant closed</span>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

export default RestaurantMenuModal;
