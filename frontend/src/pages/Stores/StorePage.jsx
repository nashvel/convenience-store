import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios-config';
import ProductCard from '../../components/Cards/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaDirections, FaShareAlt, FaCommentDots, FaStar, FaClock, FaTimesCircle, FaBoxOpen, FaSpinner, FaFilter, FaHeart, FaPhone, FaGlobe, FaChevronLeft, FaStore, FaUsers, FaAward } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LOGO_ASSET_URL } from '../../config';
import StorePageSkeleton from '../../components/Skeletons/StorePageSkeleton';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import ScrollToTopButton from '../../components/ScrollToTop/ScrollToTopButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDebounce } from '../../hooks/useDebounce';

const StorePage = () => {
  const { openChat } = useChat();
  const { user } = useAuth();
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortOption, setSortOption] = useLocalStorage(`store-${storeId}-sort`, 'best-sellers');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  const [isSorting, setIsSorting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        
        const storeResponse = await api.get(`/stores/${storeId}`);
        setStore(storeResponse.data);

        const productResponse = await api.get(`/products?store_id=${storeId}`);
        
        // Handle both direct array and paginated response formats
        const productsData = productResponse.data.products || productResponse.data;
        setProducts(productsData);

      } catch (err) {
        setError('Failed to fetch store data.');
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category_name).filter(Boolean))];
    return ['all', ...uniqueCategories];
  }, [products]);

  const storeProducts = useMemo(() => {
    const filtered = Array.isArray(products) ? products : [];

    // Filter by category
    let categoryFiltered = filtered;
    if (selectedCategory !== 'all') {
      categoryFiltered = filtered.filter(p => p.category_name === selectedCategory);
    }

    // Filter by search query
    let searched = categoryFiltered;
    if (debouncedSearchQuery) {
      const lowercasedQuery = debouncedSearchQuery.toLowerCase();
      searched = categoryFiltered.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        (p.description && p.description.toLowerCase().includes(lowercasedQuery)) ||
        (p.category_name && p.category_name.toLowerCase().includes(lowercasedQuery))
      );
    }

    // Sort products
    const sorted = [...searched];
    switch (sortOption) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)); break;
      case 'best-sellers': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return sorted;
  }, [products, storeId, debouncedSearchQuery, sortOption, selectedCategory]);

  const handleSortChange = (newSortOption) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(newSortOption);
      setIsSorting(false);
    }, 300);
  };

  const handleLikeStore = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites', {
      position: 'bottom-center',
      autoClose: 2000
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('🔗 Store link copied to clipboard!', {
        position: 'bottom-center',
        autoClose: 2000
      });
    } catch (err) {
      toast.error('Failed to copy link.');
      console.error('Failed to copy: ', err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  if (loading) return <StorePageSkeleton />;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-red-500">Error: {error}</div>;
  if (!store) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">Store not found.</div>;

  const logoUrl = store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : '';

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-10">
      {/* Enhanced Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/stores" className="text-gray-500 hover:text-primary transition-colors">
              Stores
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{store.name}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Store Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Store Cover & Info */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Store Logo & Info */}
              <div className="relative z-10 h-full flex items-end p-8">
                <div className="flex items-end gap-6 w-full">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="relative"
                  >
                    {logoUrl ? (
                      <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-2xl">
                        <img 
                          src={logoUrl} 
                          alt={store.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center">
                        <FaStore className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="flex-1 text-white">
                    <motion.h1 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl font-bold mb-3"
                    >
                      {store.name}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-blue-100 mb-4 text-lg"
                    >
                      {store.description || 'Welcome to our store!'}
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap items-center gap-6 text-sm"
                    >
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <FaMapMarkerAlt className="text-blue-200" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <FaStar className="text-yellow-400" />
                        <span>4.8 (324 reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                        <span>Open Now</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Like Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    onClick={handleLikeStore}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isLiked 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    <FaHeart className={`text-xl ${isLiked ? 'animate-pulse' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 bg-white border-b">
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Check if user is logged in
                    if (!user) {
                      window.location.href = '/login';
                      return;
                    }
                    
                    if (!store.client_id) {
                      toast.error('Messaging is not available for this store.');
                      return;
                    }
                    const chatRecipient = {
                      id: store.client_id,
                      first_name: store.name,
                      last_name: '',
                      avatar: store.logo,
                      name: store.name,
                    };
                    openChat(chatRecipient);
                  }}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaCommentDots className="text-lg" />
                  <span>Message Store</span>
                </motion.button>
                
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaDirections className="text-lg" />
                  <span>Get Directions</span>
                </motion.a>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaShareAlt className="text-lg" />
                  <span>Share Store</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Products Header */}
          <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBoxOpen className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Store Products</h2>
                  <p className="text-gray-600">{storeProducts.length} products available</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFilter className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                Filters
              </button>
            </div>
            
            {/* Enhanced Search and Controls */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, categories, or descriptions..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                />
                {searchInput && (
                  <button 
                    onClick={() => setSearchInput('')} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimesCircle className="text-xl" />
                  </button>
                )}
              </div>
              
              {/* Filters and Sort */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl">
                      {/* Category Filter */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category === 'all' ? 'All Categories' : category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Sort Options */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select 
                          value={sortOption} 
                          onChange={(e) => handleSortChange(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="best-sellers">⭐ Best Sellers</option>
                          <option value="newest">🆕 Newest First</option>
                          <option value="price-asc">💰 Price: Low to High</option>
                          <option value="price-desc">💎 Price: High to Low</option>
                          <option value="name-asc">🔤 Name: A to Z</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="p-6">
            <div className="relative min-h-[400px]">
              <AnimatePresence>
                {isSorting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 rounded-xl"
                  >
                    <div className="text-center">
                      <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-600 font-medium">Sorting products...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                layout
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-all duration-300 ${
                  isSorting ? 'blur-sm opacity-50' : ''
                }`}
              >
                <AnimatePresence>
                  {storeProducts.length > 0 ? (
                    storeProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        layout
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="col-span-full text-center py-16 px-6"
                    >
                      <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaBoxOpen className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                          {searchInput || selectedCategory !== 'all' 
                            ? 'No matching products found' 
                            : 'No products available'
                          }
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchInput || selectedCategory !== 'all'
                            ? 'Try adjusting your search or filters to find what you\'re looking for.'
                            : 'This store hasn\'t listed any products yet. Please check back later!'
                          }
                        </p>
                        {(searchInput || selectedCategory !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchInput('');
                              setSelectedCategory('all');
                            }}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};

export default StorePage;
