import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import { FaSearch } from 'react-icons/fa';
import ProductCardSkeleton from '../../components/Skeletons/ProductCardSkeleton';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts: products, loading, error, categories, priceRange } = useContext(StoreContext);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = queryParams.get('category');
  const dealsParam = queryParams.get('deals') === 'true';
  const searchParam = queryParams.get('search');



  const [sortOption, setSortOption] = useState(queryParams.get('sort') || 'best-sellers');
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [categoryParam, searchParam, priceRange, sortOption, dealsParam]);

  const filteredProducts = useMemo(() => {
    if (loading || error) return [];

    let result = [...products];

    const currentCategory = categoryParam || 'all';
    if (currentCategory !== 'all') {
      result = result.filter(product => product.category_name === currentCategory);
    }

    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }

    result = result.filter(product => {
      const min = priceRange.min === '' || isNaN(priceRange.min) ? 0 : priceRange.min;
      const max = priceRange.max === '' || isNaN(priceRange.max) ? Infinity : priceRange.max;
      return product.price >= min && product.price <= max;
    });

    if (dealsParam) {
      result = result.filter(product => product.discount > 0);
    }

    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'best-sellers':
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, categoryParam, searchParam, priceRange, sortOption, dealsParam, loading, error]);



  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    updateURLParams({ sort: newSortOption });
  };

  const handleCategoryChange = (category) => {
    updateURLParams({ category: category === 'all' ? null : category });
  };

  const handleSearchChange = (e) => {
    updateURLParams({ search: e.target.value });
  };

  const currentCategory = categoryParam || 'all';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-3xl font-bold">Our Products</h4>
      </div>

      <main>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchParam || ''}
                onChange={handleSearchChange}
                className="pl-10 p-2 border rounded-md w-full md:w-64"
              />
            </div>
            <select value={sortOption} onChange={handleSortChange} className="p-2 border rounded-md w-full md:w-auto">
              <option value="best-sellers">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} products found</p>

          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.slice(0, visibleCount).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-10">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 20)}
                    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">No products match your criteria.</div>
          )}
      </main>
      <ScrollToTopButton />
    </motion.div>
  );
};

export default Products;