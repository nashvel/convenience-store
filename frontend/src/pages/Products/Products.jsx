import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/Cards/ProductCard';
import ScrollToTopButton from '../../components/ScrollToTop/ScrollToTopButton';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Fuse from 'fuse.js';
import ProductCardSkeleton from '../../components/Skeletons/ProductCardSkeleton';

const categoryImageMap = {
  'Books': '/images/cards/books.png',
  'Electronics': '/images/cards/electronics.png',
  'Fashion': '/images/cards/fashion.png',
  'Foods': '/images/cards/foods.png',
  'Home & Kitchen': '/images/cards/homeandkitchen.png',
  'Sports & Outdoor': '/images/cards/sportsandoutdoor.png',
};

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, categories, loading, error } = useContext(StoreContext);
  const products = allProducts;

  // State for controlled inputs, which get their initial value from the URL
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('search') || '');
  const [sortOption, setSortOption] = useState(new URLSearchParams(location.search).get('sort') || 'best-sellers');
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchSuggestion, setSearchSuggestion] = useState('');

  const mainCategoryNames = useMemo(() => {
    if (!categories) return [];
    return categories.filter(c => !c.parent_id).map(c => c.name);
  }, [categories]);

  // When filters change, reset pagination
  useEffect(() => {
    setVisibleCount(20);
  }, [location.search]);

  // Calculate active filters instantly from the URL for responsive UI
  const activeFilters = useMemo(() => {
    const filters = [];
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      categoryParam.split(',').forEach(cat => {
        if (!mainCategoryNames.includes(cat)) {
          filters.push({ type: 'category', value: cat, label: cat, key: `cat-${cat}` });
        }
      });
    }
    if (params.get('on_deal') === 'true') {
      filters.push({ type: 'on_deal', value: 'true', label: 'On Deal', key: 'deal' });
    }
    if (params.has('min_price') && params.has('max_price')) {
      filters.push({ type: 'price', value: `${params.get('min_price')}-${params.get('max_price')}`, label: `₱${params.get('min_price')} - ₱${params.get('max_price')}`, key: 'price' });
    }
    return filters;
  }, [location.search]);



  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    updateURLParams({ sort: newSortOption });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURLParams({ search: searchTerm });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    updateURLParams({ search: suggestion });
  };

  const removeFilter = (filter) => {
    const params = new URLSearchParams(location.search);
    if (filter.type === 'category') {
      const categories = params.get('category').split(',').filter(c => c !== filter.value);
      if (categories.length > 0) {
        params.set('category', categories.join(','));
      } else {
        params.delete('category');
      }
    } else {
      params.delete(filter.type);
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const clearAllFilters = () => {
    navigate({ search: '' }, { replace: true });
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        {/* Active Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <AnimatePresence>
            {activeFilters.map(filter => (
              <motion.span
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.15 },
                  layout: { duration: 0.2, ease: 'easeInOut' }
                }}
                key={filter.key}
                className="bg-blue-100 text-primary font-semibold px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm flex-shrink-0"
              >
                {filter.label}
                <button onClick={() => removeFilter(filter)} className="ml-2 text-primary hover:bg-blue-200 rounded-full p-0.5">
                  <FaTimes size={12} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow">
            <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary pl-12 pr-4 py-3 shadow-sm"
            />
          </form>
          <div className="w-full md:w-auto flex-shrink-0">
            <select value={sortOption} onChange={handleSortChange} className="p-3 border border-gray-200 bg-gray-50 rounded-full w-full md:w-auto focus:ring-2 focus:ring-primary focus:outline-none h-[52px]">
              <option value="best-sellers">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>
        </div>

        {searchSuggestion && (
          <div className="mb-4 text-sm text-gray-600">
            Did you mean:{" "}
            <button
              onClick={() => handleSuggestionClick(searchSuggestion)}
              className="text-primary font-semibold hover:underline"
            >
              {searchSuggestion}
            </button>
            ?
          </div>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button onClick={clearAllFilters} className="text-sm text-primary hover:underline font-semibold">
            Clear All Filters
          </button>
        </div>
      )}

      <main className="relative min-h-[400px]">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.slice(0, visibleCount).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {visibleCount < products.length && (
              <div className="text-center mt-10">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </motion.div>
  );
};

export default Products;