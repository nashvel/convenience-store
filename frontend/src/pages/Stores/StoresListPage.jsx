import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { LOGO_ASSET_URL, BANNER_ASSET_URL } from '../../config';
import { FaSearch, FaStore, FaTag, FaStar, FaMapMarkerAlt, FaClock, FaFilter, FaTimes, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import slugify from '../../utils/slugify';

const StoreCard = ({ store }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-3 transition-all duration-300 ease-in-out hover:shadow-2xl"
  >
    <Link to={`/stores/${store.id}/${slugify(store.name)}`} className="block">
      {/* Banner with Gradient Overlay */}
      <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        <img 
          src={store.banner ? `${BANNER_ASSET_URL}/${store.banner}` : `https://placehold.co/400x150/E0E7FF/1D4ED8?text=Visit+${encodeURIComponent(store.name)}`}
          alt={`${store.name} banner`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Store Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Open
          </span>
        </div>
        
        {/* Logo with Enhanced Styling */}
        <div className="absolute -bottom-12 left-4">
          <div className="relative">
            <img 
              src={store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : `https://placehold.co/100x100/FFFFFF/1D4ED8?text=${encodeURIComponent(store.name.charAt(0))}`}
              alt={`${store.name} logo`}
              className="w-24 h-24 object-cover rounded-2xl border-4 border-white shadow-xl bg-white group-hover:border-blue-200 transition-colors duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <FaArrowRight className="text-white text-xs transform group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content with Enhanced Layout */}
      <div className="pt-16 px-6 pb-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {store.name}
          </h3>
          <div className="flex items-center text-sm text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
            <FaStar className="mr-1" />
            <span className="font-semibold">{store.rating || '4.8'}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
          {store.description || 'Discover amazing products and exceptional service with our trusted partner.'}
        </p>
        
        {/* Enhanced Info Section */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <FaTag className="mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate font-medium">{store.category || 'General Store'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaMapMarkerAlt className="mr-2 text-red-400 flex-shrink-0" />
            <span className="truncate">{store.location || 'Available Online'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2 text-green-500 flex-shrink-0" />
            <span>Open until 10:00 PM</span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Visit Store</span>
            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              <span className="mr-2">Explore</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const StoreCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="h-36 bg-gray-200 animate-pulse relative">
      <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300 rounded-full"></div>
      <div className="absolute -bottom-12 left-4 w-24 h-24 rounded-2xl bg-gray-300 border-4 border-white"></div>
    </div>
    <div className="pt-16 px-6 pb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => 
    ['All', ...new Set(stores.map(s => s.category || 'General'))]
  , [stores]);

  const filteredStores = useMemo(() => {
    let filtered = stores.filter(store => {
      const matchesCategory = selectedCategory === 'All' || (store.category || 'General') === selectedCategory;
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (store.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 4.5) - (a.rating || 4.5);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [stores, searchQuery, selectedCategory, sortBy]);

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Enhanced Header with Better Search */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-20 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search Section */}
            <div className="w-full lg:w-2/5">
              <div className="relative group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search stores, products, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3.5 pl-12 pr-12 border-2 border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FaFilter className="text-sm" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600 mr-2">Categories:</span>
                  {categories.map(category => (
                    <motion.button 
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                      }`}
                    >
                      {category}
                      {selectedCategory === category && (
                        <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                          {category === 'All' ? stores.length : stores.filter(s => (s.category || 'General') === category).length}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header Section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          
          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaStore className="text-blue-500" />
              <span><strong className="text-gray-700">{filteredStores.length}</strong> stores found</span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2">
                <FaSearch className="text-green-500" />
                <span>for "<strong className="text-gray-700">{searchQuery}</strong>"</span>
              </div>
            )}
            {selectedCategory !== 'All' && (
              <div className="flex items-center gap-2">
                <FaTag className="text-purple-500" />
                <span>in <strong className="text-gray-700">{selectedCategory}</strong></span>
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, index) => <StoreCardSkeleton key={index} />)}
          </div>
        ) : filteredStores.length > 0 ? (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20 px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FaStore className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Stores Found</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {searchQuery 
                  ? `No stores match "${searchQuery}" in the ${selectedCategory === 'All' ? 'selected' : selectedCategory} category.`
                  : `No stores available in the ${selectedCategory} category.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                )}
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default StoresListPage;
