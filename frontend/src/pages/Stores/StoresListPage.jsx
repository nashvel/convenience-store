import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { LOGO_ASSET_URL, BANNER_ASSET_URL } from '../../config';
import { FaSearch, FaStore, FaTag, FaStar } from 'react-icons/fa';
import slugify from '../../utils/slugify';

const StoreCard = ({ store }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out"
  >
    <Link to={`/stores/${store.id}/${slugify(store.name)}`} className="block">
      <div className="h-32 bg-gray-200 relative">
        <img 
          src={store.banner ? `${BANNER_ASSET_URL}/${store.banner}` : `https://placehold.co/400x150/E0E7FF/1D4ED8?text=Visit+${encodeURIComponent(store.name)}`}
          alt={`${store.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-10 left-4">
          <img 
            src={store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : `https://placehold.co/100x100/FFFFFF/1D4ED8?text=${encodeURIComponent(store.name.charAt(0))}`}
            alt={`${store.name} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md bg-white"
          />
        </div>
      </div>
      <div className="pt-14 px-4 pb-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{store.name}</h3>
        <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden">{store.description || 'A great place to shop for your needs.'}</p>
        <div className="flex items-center text-sm text-gray-600 mt-3">
          <FaTag className="mr-2 text-primary" />
          <span>{store.category || 'General'}</span>
          <span className="mx-2">•</span>
          <FaStar className="mr-1 text-yellow-400" />
          <span>{store.rating || '4.5'}</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const StoreCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="h-32 bg-gray-200 animate-pulse"></div>
    <div className="pt-14 px-4 pb-4 relative">
      <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full bg-gray-300 border-4 border-white"></div>
      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mt-3"></div>
    </div>
  </div>
);

const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => 
    ['All', ...new Set(stores.map(s => s.category || 'General'))]
  , [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesCategory = selectedCategory === 'All' || (store.category || 'General') === selectedCategory;
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stores, searchQuery, selectedCategory]);

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-12 pr-4 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="w-full md:w-auto flex-grow overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2">
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Stores</h1>
          <p className="text-gray-600 mt-1">Discover our trusted partners and a world of quality products.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => <StoreCardSkeleton key={index} />)}
          </div>
        ) : filteredStores.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredStores.map((store) => <StoreCard key={store.id} store={store} />)}
          </motion.div>
        ) : (
          <div className="text-center py-20 px-6">
            <FaStore className="mx-auto text-6xl text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No Stores Found</h3>
            <p className="mt-2 text-gray-500">No stores match your current filters. Try adjusting your search or category selection.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StoresListPage;
