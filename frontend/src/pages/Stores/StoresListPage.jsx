import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { UIContext } from '../../context/UIContext';
import { LOGO_ASSET_URL } from '../../config';
import { FaSearch } from 'react-icons/fa';
import slugify from '../../utils/slugify';

// Forcing a re-compile to fix a caching issue.
const StoresListPage = () => {
  const { stores, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const { isPageScrolled, setIsPageScrolled } = useContext(UIContext);
  const titleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        if (titleRef.current.getBoundingClientRect().top < 80) {
          setIsPageScrolled(true);
        } else {
          setIsPageScrolled(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to reset the scroll state when leaving the page
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setIsPageScrolled(false);
    };
  }, [setIsPageScrolled]);

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
    <LayoutGroup>
      <div className="fixed top-20 left-0 right-0 h-24 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center shadow-md">
        <motion.div
          className="text-center"
          animate={{ opacity: isPageScrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1 layoutId="stores-title" className="text-2xl font-bold text-gray-800">All Stores</motion.h1>
          <motion.p layoutId="stores-subtitle" className="text-sm text-gray-600 mt-1">Visit our trusted partners and discover a world of quality products.</motion.p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-28 pb-10 md:pt-32">
        <div ref={titleRef} className="text-center mb-12 flex items-center justify-center" style={{ minHeight: '136px' }}>
          <motion.div
            className="text-center"
            animate={{ opacity: isPageScrolled ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1 layoutId="stores-title" className="text-4xl font-bold text-center mb-5 text-primary">All Stores</motion.h1>
            <motion.p layoutId="stores-subtitle" className="text-center text-lg text-gray-500 mb-10 max-w-2xl mx-auto">Visit our trusted partners and discover a world of quality products.</motion.p>
          </motion.div>
        </div>

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
                  <img src={store.logo === 'placeholder' ? `https://via.placeholder.com/400x200.png/007bff/FFFFFF?text=${encodeURIComponent(store.name)}` : `${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} className="w-24 h-24 object-contain mb-4" />
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
      </div>
    </LayoutGroup>
  );
};

export default StoresListPage;
