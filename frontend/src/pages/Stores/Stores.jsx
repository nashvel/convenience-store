import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { ASSET_BASE_URL } from '../../config';
import { motion } from 'framer-motion';
import slugify from '../../utils/slugify';
import StoreCardSkeleton from '../../components/Skeletons/StoreCardSkeleton';
import { FaStore, FaStar, FaMapMarkerAlt, FaArrowRight, FaShoppingBag } from 'react-icons/fa';

const Stores = () => {
  const { stores, loading, error } = useContext(StoreContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="h-12 bg-white/20 rounded-lg w-2/3 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <StoreCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaStore className="mx-auto text-6xl text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <FaShoppingBag className="mx-auto text-6xl mb-6 opacity-90" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Discover Amazing Stores
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Explore our curated collection of trusted partners and discover a world of quality products at your fingertips.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full"></div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <FaStore className="mx-auto text-4xl text-blue-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{stores.length}+</h3>
              <p className="text-gray-600 font-medium">Trusted Stores</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <FaStar className="mx-auto text-4xl text-yellow-500 mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">4.8</h3>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <FaShoppingBag className="mx-auto text-4xl text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">10K+</h3>
              <p className="text-gray-600 font-medium">Products Available</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stores Grid */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Stores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully selected partners offering the best products and services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link 
                  to={`/store/${store.id}/${slugify(store.name)}`}
                  className="group block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Store Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    <img 
                      src={`${ASSET_BASE_URL}/logos/${store.logo}`} 
                      alt={`${store.name} logo`} 
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Store Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {store.name}
                      </h3>
                      <FaArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {store.description || 'Discover amazing products and exceptional service.'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-2 text-red-400" />
                        <span className="truncate">{store.location || 'Available Online'}</span>
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Stores;
