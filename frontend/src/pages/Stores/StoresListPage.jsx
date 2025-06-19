import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { LOGO_ASSET_URL } from '../../config';
import { FaSearch } from 'react-icons/fa';
import slugify from '../../utils/slugify';

const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    if (!searchQuery) {
      return stores;
    }
    return stores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-5 pt-20 pb-10">Loading stores...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-5 pt-20 pb-10">Error: {error}</div>;
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto px-5 pt-20 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-5 text-primary">All Stores</h1>
      <p className="text-center text-lg text-gray-500 mb-10 max-w-2xl mx-auto">Visit our trusted partners and discover a world of quality products.</p>
      <div className="relative w-full max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="Search for your favorite store..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pl-12 pr-5 border border-gray-300 rounded-full bg-gray-100 text-gray-800 text-base transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
      </div>

      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredStores.map((store) => (
            <motion.div
              key={store.id}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Link
                to={`/stores/${store.id}/${slugify(store.name)}`}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-5 text-decoration-none shadow-md transition-all duration-300 text-center h-full"
              >
                <img src={`${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} className="w-24 h-24 object-contain mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-5 text-gray-500">
          <div className="text-5xl mb-4">😞</div>
          <p className="text-lg font-medium text-gray-800 mb-2">No stores found matching "{searchQuery}"</p>
          <p className="text-base">Try a different search or check your spelling.</p>
        </div>
      )}
    </motion.div>
  );
};

export default StoresListPage;
