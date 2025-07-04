import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaCheck, FaTimes, FaBolt, FaShippingFast, FaShieldAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';
import Reviews from '../../components/Reviews';
import ProductCard from '../../components/ProductCard';
import { PRODUCT_ASSET_URL } from '../../config';
import ProductDetailsSkeleton from '../../components/Skeletons/ProductDetailsSkeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, stores, loading, error, isFavorite, toggleFavorite, addToCart } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const product = !loading && allProducts.length > 0 ? allProducts.find(p => String(p.id) === id) : null;
  const store = product ? stores.find(s => s.id === product.store_id) : null;

  // Augmented product data for UI enhancements
  const productData = product ? {
    ...product,
    // NOTE: Using placeholder images for gallery. In a real app, these would come from the backend.
    images: [
      product.image,
      'products/product-placeholder-2.jpg',
      'products/product-placeholder-3.jpg',
      'products/product-placeholder-4.jpg',
    ],
    specifications: [
      { name: 'SKU', value: product.sku || 'N/A' },
      { name: 'Brand', value: product.brand || 'N/A' },
      { name: 'Weight', value: product.weight || 'Approx. 500g' },
      { name: 'Dimensions', value: product.dimensions || '10cm x 10cm x 5cm' },
    ]
  } : null;

  const suggestedProducts = product
    ? allProducts.filter(p => p.category === product.category && String(p.id) !== id).slice(0, 5)
    : [];

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) return <ProductDetailsSkeleton />;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <h2 className="text-2xl font-bold mb-4">{error}</h2>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Products</Link>
    </div>
  );

  if (!productData) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Back to Products</Link>
    </div>
  );

  const favorite = isFavorite(productData.id);
  const isOutOfStock = !productData || Number(productData.stock) <= 0;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${productData.category}`} className="hover:text-blue-600">{productData.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium truncate">{productData.name}</span>
      </div>
      
      <div className="grid md:grid-cols-5 gap-12 items-start">
        {/* Image Gallery */}
        <div className="md:col-span-2">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-lg mb-4 aspect-square">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={`${PRODUCT_ASSET_URL}/${productData.images[activeImage]}`}
                alt={`${productData.name} view ${activeImage + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"/>
            </AnimatePresence>
            <button 
              onClick={() => toggleFavorite(productData.id)}
              className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-all duration-300 ${favorite ? 'text-red-500 scale-110' : 'text-gray-500'} hover:text-red-500 hover:scale-110`}
            >
              {favorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productData.images.map((img, index) => (
              <div 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'} hover:border-blue-400 transition-all`}
              >
                <img src={`${PRODUCT_ASSET_URL}/${img}`} alt={`${productData.name} thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col md:col-span-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{productData.name}</h1>
          {store && (
            <Link to={`/stores/${store.id}/${store.name}`} className="text-gray-600 hover:text-blue-600 mb-4 font-medium">
              Sold by {store.name}
            </Link>
          )}
          
          <div className="flex items-center gap-4 mb-4">
            <p className="text-4xl font-bold text-blue-600">
              ₱{productData.price ? Number(productData.price).toFixed(2) : '0.00'}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(productData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="text-gray-600 ml-1">({productData.rating ? productData.rating.toFixed(1) : '0.0'})</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 font-semibold mb-6 text-lg ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
            {isOutOfStock ? <FaTimes /> : <FaCheck />} {isOutOfStock ? 'Out of Stock' : `In Stock`}
            {!isOutOfStock && productData.stock < 10 && <span className='text-orange-500 font-bold'>(Only {productData.stock} left!)</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1} className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">-</button>
              <input type="number" min="1" max={productData.stock} value={quantity} onChange={handleQuantityChange} className="w-16 h-12 text-center border-x border-gray-300 text-gray-800 focus:outline-none"/>
              <button onClick={() => quantity < productData.stock && setQuantity(quantity + 1)} disabled={quantity >= productData.stock} className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"><FaShoppingCart />Add to Cart</button>
          </div>
          <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"><FaBolt />Buy Now</button>

          <div className="mt-8 border-t border-gray-200 pt-6 space-y-4 text-sm">
            <div className="flex items-center text-gray-600"><FaShippingFast className="w-5 h-5 mr-3 text-blue-500"/><span>Estimated delivery: 3-5 business days</span></div>
            <div className="flex items-center text-gray-600"><FaShieldAlt className="w-5 h-5 mr-3 text-blue-500"/><span>1-Year Manufacturer Warranty</span></div>
          </div>
        </div>
      </div>

      {/* Tabs for Description, Specs, Reviews */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'description' && <p className="text-gray-700 leading-relaxed">{productData.description}</p>}
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {productData.specifications.map(spec => (
                    <div key={spec.name} className="flex border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-600 w-1/3">{spec.name}</span>
                      <span className="text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'reviews' && <Reviews productId={productData.id} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
            {suggestedProducts.map(p => <ProductCard key={p.id} product={p} size="small" />)}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetails;