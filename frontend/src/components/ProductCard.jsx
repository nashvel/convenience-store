import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

import { StoreContext } from '../context/StoreContext';
import { PRODUCT_ASSET_URL } from '../config';
import slugify from '../utils/slugify';

const ProductCard = ({ product }) => {
  
  const { stores } = useContext(StoreContext);

  const store = stores.find(s => s.id === product.store_id);



  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full group"
    >
      <Link to={`/product/${product.id}/${slugify(product.name)}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={`${PRODUCT_ASSET_URL}/${product.image}`}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.stock > 0 ? null : (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</div>
          )}
           {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{store ? store.name : 'Unknown Store'}</p>
        <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        <div className="mt-auto flex justify-between items-center">
           <p className="text-lg font-bold text-blue-600">
            {product.discount > 0 ? (
              <span className="flex items-baseline gap-2">
                ₱{Number(product.price * (1 - product.discount / 100)).toFixed(2)}
                <span className="text-sm text-gray-500 line-through">₱{Number(product.price).toFixed(2)}</span>
              </span>
            ) : (
              `₱${Number(product.price).toFixed(2)}`
            )}
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="text-yellow-400 mr-1" /> {product.rating}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;