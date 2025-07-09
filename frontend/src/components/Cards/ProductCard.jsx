import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

import { StoreContext } from '../../context/StoreContext';
import { CartContext } from '../../context/CartContext';
import { useAuth, AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PRODUCT_ASSET_URL } from '../../config';
import slugify from '../../utils/slugify';

const ProductCard = ({ product, size = 'normal' }) => {
  
  const { stores } = useContext(StoreContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const store = stores.find(s => s.id === product.store_id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // The CartContext will handle all notifications (success or error).
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full group border border-transparent hover:border-primary hover:shadow-xl"
    >
      <Link to={`/product/${product.id}/${slugify(product.name)}`} className="block">
        <div className="relative w-full aspect-square overflow-hidden">
          <img 
            src={`${PRODUCT_ASSET_URL}/${product.image}`}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlays and Actions */}
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-20">
            {product.stock > 0 ? (
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                aria-label="Add to cart"
              >
                <FaShoppingCart className="h-6 w-6" />
              </button>
            ) : (
              <div className="absolute inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>
      <div className={`${size === 'small' ? 'p-2' : 'p-4'} flex flex-col flex-grow border-t border-gray-200`}>
        <p className={`${size === 'small' ? 'text-[9px]' : 'text-[10px]'} text-gray-500 uppercase font-semibold mb-1`}>{store ? store.name : 'Unknown Store'}</p>
        <h3 className={`${size === 'small' ? 'text-[11px] leading-tight' : 'text-xs'} font-semibold text-gray-800 mb-1 truncate`}>{product.name}</h3>
        <div className="mt-auto flex justify-between items-center">
           <p className={`${size === 'small' ? 'text-sm' : 'text-base'} font-bold text-blue-600`}>
            {product.discount > 0 ? (
              <span className="flex items-baseline gap-1">
                ₱{Number(product.price * (1 - product.discount / 100)).toFixed(2)}
                <span className={`${size === 'small' ? 'text-[10px]' : 'text-xs'} text-gray-500 line-through`}>₱{Number(product.price).toFixed(2)}</span>
              </span>
            ) : (
              `₱${Number(product.price).toFixed(2)}`
            )}
          </p>
          <div className={`flex items-center ${size === 'small' ? 'text-[10px]' : 'text-xs'} text-gray-600`}>
            <FaStar className="text-yellow-400 mr-1" /> {product.rating}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;