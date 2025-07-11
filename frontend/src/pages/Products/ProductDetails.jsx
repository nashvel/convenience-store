import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaCheck, FaTimes, FaBolt, FaShippingFast, FaShieldAlt, FaChevronDown, FaChevronUp, FaChevronRight, FaCheckCircle, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import Reviews from '../../components/Reviews/Reviews';
import ProductCard from '../../components/Cards/ProductCard';
import { PRODUCT_ASSET_URL } from '../../config';
import ProductDetailsSkeleton from '../../components/Skeletons/ProductDetailsSkeleton';
import ShopConfidenceModal from '../../components/Modals/ShopConfidenceModal';

const ProductDetails = () => {
  const { user } = useAuth();
  const { openChat } = useChat();
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, stores, loading, error, isFavorite, toggleFavorite, addToCart } = useContext(StoreContext);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isConfidenceModalOpen, setConfidenceModalOpen] = useState(false);

  const getDiscount = () => {
    if (!productData.has_discount) return null;
    if (productData.discount_type === 'percentage') {
      return `${productData.discount_value}%`;
    }
    if (productData.discount_type === 'fixed') {
        return `₱${productData.discount_value}`;
    }
    // Fallback calculation if type is missing but prices are available
    const discount = productData.original_price - productData.price;
    return `₱${discount.toFixed(2)}`;
  };

  const product = !loading && allProducts.length > 0 ? allProducts.find(p => String(p.id) === id) : null;
  const store = product && stores.length > 0 ? stores.find(s => s.id === product.store_id) : null;

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
    ? allProducts.filter(p => p.category_name === product.category_name && String(p.id) !== id).slice(0, 5)
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

  const handleChat = () => {
    if (!user) {
      toast.warn('Please log in to get assistance.');
      return;
    }

    if (user.role !== 'customer') {
      toast.warn('Only customers can use this chat.');
      return;
    }

    if (product && product.store && product.store.owner) {
      if (user.id === product.store.owner.id) {
        toast.info("You can't open a chat with your own store.");
        return;
      }
      
      const chatRecipient = {
        id: product.store.owner.id, // The recipient ID is the owner's ID
        name: product.store.name, // Display the store's name
        first_name: product.store.name, // Use store name for display
        last_name: '', // Keep last_name empty
        avatar_url: product.store.logo_url, // Use the store's logo
      };
      openChat(chatRecipient);
    } else {
      toast.error('Store information is not available.');
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
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <FaChevronRight size={12} className="mx-2 text-gray-400" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
        {productData.parent_category_name && (
          <>
            <FaChevronRight size={12} className="mx-2 text-gray-400" />
            <Link to={`/products?category=${encodeURIComponent(productData.parent_category_name)}`} className="hover:text-blue-600 transition-colors">{productData.parent_category_name}</Link>
          </>
        )}
        {productData.category_name && (
          <>
            <FaChevronRight size={12} className="mx-2 text-gray-400" />
            <Link to={`/products?category=${encodeURIComponent(productData.category_name)}`} className="hover:text-blue-600 transition-colors">{productData.category_name}</Link>
          </>
        )}
        <FaChevronRight size={12} className="mx-2 text-gray-400" />
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
          <div className="flex items-center gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{productData.name}</h1>
              {productData.has_discount && (
                <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-md shadow-lg">
                  -{getDiscount()}
                </div>
              )}
            </div>
            {product.store && (
              <p className="text-lg text-gray-700 mb-2">Sold by: 
                <Link to={`/stores/${product.store.id}`} className="text-blue-600 hover:underline">
                  {product.store.name}
                </Link>
              </p>
            )}
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline space-x-4">
                {productData.has_discount ? (
                  <>
                    <p className="text-4xl font-bold text-blue-600">
                      ₱{Number(productData.price).toFixed(2)}
                    </p>
                    <p className="text-2xl text-orange-500 line-through">
                      ₱{Number(productData.original_price).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-blue-600">
                    ₱{Number(productData.price).toFixed(2)}
                  </p>
                )}
              </div>
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

          {/* Shop Confidence Section */}
          <div 
            onClick={() => setConfidenceModalOpen(true)}
            className="flex items-center justify-between p-3 my-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-gray-500" />
                <span>Cash on delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-gray-500" />
                <span>Free 6-day Returns</span>
              </div>
            </div>
            <FaChevronRight className="text-gray-400" />
          </div>

          <div className="space-y-6 mb-8">
            {/* Quantity Selector */}
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 mr-4">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1} className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">-</button>
                <input type="number" min="1" max={productData.stock} value={quantity} onChange={handleQuantityChange} className="w-16 h-12 text-center border-x border-gray-300 text-gray-800 focus:outline-none"/>
                <button onClick={() => quantity < productData.stock && setQuantity(quantity + 1)} disabled={quantity >= productData.stock} className="w-12 h-12 text-xl text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"><FaShoppingCart />Add to Cart</button>
              <button onClick={handleBuyNow} disabled={isOutOfStock} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"><FaBolt />Buy Now</button>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={handleChat} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2">
              <FaComments /> Get Assistance
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-center text-gray-600"><FaShippingFast className="w-5 h-5 mr-3 text-blue-500"/><span>Estimated delivery: 3-5 business days</span></div>
              <div className="flex items-center text-gray-600"><FaShieldAlt className="w-5 h-5 mr-3 text-blue-500"/><span>1-Year Manufacturer Warranty</span></div>
            </div>
            
            {/* Deals Section */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Deals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-teal-50/50 border border-teal-200/60 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 text-teal-600 font-bold text-xs p-1 rounded">VOUCHER</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Shipping Voucher</p>
                      <p className="text-xs text-gray-500">₱30 off shipping on orders ₱50+</p>
                    </div>
                  </div>
                  <button className="bg-teal-500 text-white font-bold py-1.5 px-4 rounded-md hover:bg-teal-600 transition-colors text-sm">Claim</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShopConfidenceModal isOpen={isConfidenceModalOpen} onClose={() => setConfidenceModalOpen(false)} />

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