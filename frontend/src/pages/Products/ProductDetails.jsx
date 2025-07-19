import React, { useContext, useState, useEffect } from 'react';
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
import api from '../../api/axios-config';
import ProductDetailsSkeleton from '../../components/Skeletons/ProductDetailsSkeleton';
import ShopConfidenceModal from '../../components/Modals/ShopConfidenceModal';
import VariantSelectionModal from '../../components/Modals/VariantSelectionModal';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const ProductDetails = () => {
  const { user } = useAuth();
  const { openChat } = useChat();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useContext(StoreContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isConfidenceModalOpen, setConfidenceModalOpen] = useState(false);
  const [isVariantModalOpen, setVariantModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        if (response.data.product_type === 'variable' && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when changing variant
  };

  const handleAddToCart = () => {
    if (product.product_type === 'variable') {
      setVariantModalOpen(true);
    } else {
      addToCartContext(product, 1);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product.product_type === 'variable') {
      setVariantModalOpen(true);
    } else {
      addToCartContext(product, 1);
      navigate('/checkout');
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
        id: product.store.owner.id,
        name: product.store.name,
        first_name: product.store.name,
        last_name: '',
        avatar: product.store.logo_url,
        role: 'client'
      };

      // Create initial message with product information and image
      const productPrice = selectedVariant ? selectedVariant.price : product.price;
      const displayPrice = productPrice ? `₱${parseFloat(productPrice).toFixed(2)}` : 'Price not available';
      const productUrl = `${window.location.origin}/product/${product.id}/${product.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')}`;
      const productImageUrl = `${PRODUCT_ASSET_URL}/${product.image || 'default.png'}`;
      
      const initialMessage = {
        text: `Hi! I'm interested in this product:\n\n**${product.name}**\n${displayPrice}\n\nProduct Link: ${productUrl}\n\nProduct Image: ${productImageUrl}\n\nCan you help me with more information?`,
        files: [] // Image will be displayed via URL in the text
      };

      openChat(chatRecipient, initialMessage);
      toast.success('Chat opened with product information!');
    } else {
      toast.error('Store information is not available.');
    }
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const isOutOfStock = (selectedVariant ? selectedVariant.stock : product.stock) === 0;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const getPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? null : num;
  };

  const displayPrice = getPrice(selectedVariant ? selectedVariant.price : product.price);
  const originalPrice = getPrice(selectedVariant?.original_price || product.original_price);
  const displayImage = selectedVariant?.image_url ? `${PRODUCT_ASSET_URL}/${selectedVariant.image_url}` : `${PRODUCT_ASSET_URL}/${product.image}`;

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/products' },
  ];
  if (product.parent_category_name) {
    breadcrumbItems.push({ label: product.parent_category_name, link: `/products?category=${encodeURIComponent(product.parent_category_name)}` });
  }
  if (product.category_name) {
    breadcrumbItems.push({ label: product.category_name, link: `/products?category=${encodeURIComponent(product.category_name)}` });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Breadcrumbs items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-2">
          <img src={displayImage} alt={product.name} className="w-full h-auto object-cover rounded-2xl shadow-lg"/>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">{product.name}</h1>
          
          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({product.review_count} reviews)</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              {displayPrice !== null && <p className="text-3xl font-bold text-blue-600">₱{displayPrice.toFixed(2)}</p>}
              {originalPrice !== null && (
                <p className="text-xl text-gray-500 line-through">₱{originalPrice.toFixed(2)}</p>
              )}
            </div>
          </div>

          {product.product_type === 'simple' && (
            <div className="mt-4">
              <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Buy Now
            </button>
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
      <VariantSelectionModal isOpen={isVariantModalOpen} onClose={() => setVariantModalOpen(false)} product={product} />

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
              {activeTab === 'description' && <p className="text-gray-700 leading-relaxed">{product.description}</p>}
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-600 w-1/3">SKU</span>
                      <span className="text-gray-800">{selectedVariant ? selectedVariant.sku : 'N/A'}</span>
                    </div>
                </div>
              )}
              {activeTab === 'reviews' && <Reviews productId={product.id} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;