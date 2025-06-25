import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';
import Reviews from '../../components/Reviews';
import ProductCard from '../../components/ProductCard';
import { PRODUCT_ASSET_URL } from '../../config';
import ProductDetailsSkeleton from '../../components/Skeletons/ProductDetailsSkeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const { allProducts, stores, loading, error, isFavorite, toggleFavorite, addToCart } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1);

  const product = !loading && allProducts.length > 0 ? allProducts.find(p => String(p.id) === id) : null;
  const store = product ? stores.find(s => s.id === product.store_id) : null;

  const suggestedProducts = product
    ? allProducts.filter(p => p.store_id === product.store_id && String(p.id) !== id).slice(0, 5)
    : [];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Products</Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const isOutOfStock = !product || Number(product.stock) <= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6">
        <FaArrowLeft /> Back to Products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
          <img src={`${PRODUCT_ASSET_URL}/${product.image}`} alt={product.name} className="w-full h-auto aspect-square object-cover"/>
          <button 
            onClick={() => toggleFavorite(product.id)}
            className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors duration-300 ${favorite ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
          >
            {favorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500 uppercase mb-1">{product.category}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {store && (
            <Link to={`/stores/${store.id}`} className="text-gray-600 hover:text-blue-600 mb-4">
              Sold by {store.name}
            </Link>
          )}
          
          <div className="flex items-center gap-2 mb-4">
            <p className="text-3xl font-bold text-blue-600">
              ₱{product && product.price ? Number(product.price).toFixed(2) : '0.00'}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 font-semibold mb-4 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
            {isOutOfStock ? <FaTimes /> : <FaCheck />} {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
          </div>
          
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
            <span className="text-gray-600 ml-2">({product && product.rating ? product.rating.toFixed(1) : '0.0'})</span>
          </div>
          
          <hr className="my-5"/>
          
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-12 text-center border-x border-gray-300 text-gray-800 focus:outline-none"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart} 
              disabled={isOutOfStock}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium text-gray-500 w-20">SKU:</span>
              <span className="text-gray-800">{product.sku || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-500 w-20">Brand:</span>
              <span className="text-gray-800">{product.brand || 'N/A'}</span>
            </div>
          </div>

        </div>
      </div>

      <Reviews productId={product.id} />

      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">More from {store?.name || 'this store'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {suggestedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default ProductDetails;