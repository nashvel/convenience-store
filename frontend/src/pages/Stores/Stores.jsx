import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { ASSET_BASE_URL } from '../../config';
import { motion } from 'framer-motion';
import slugify from '../../utils/slugify';
import StoreCardSkeleton from '../../components/Skeletons/StoreCardSkeleton';

const Stores = () => {
  const { stores, loading, error } = useContext(StoreContext);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16 animate-pulse">
        <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto mb-12"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Stores</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map(store => (
          <Link 
            key={store.id} 
            to={`/store/${store.id}/${slugify(store.name)}`}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <img src={`${ASSET_BASE_URL}/logos/${store.logo}`} alt={`${store.name} logo`} className="w-full h-40 object-contain p-4 bg-gray-50" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-2">{store.name}</h2>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden">{store.description}</p>
              <p className="text-sm text-gray-500">{store.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Stores;
