import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import { FaFilter, FaSearch } from 'react-icons/fa';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts: products, loading, error, categories } = useContext(StoreContext);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = queryParams.get('category');
  const dealsParam = queryParams.get('deals') === 'true';
  const searchParam = queryParams.get('search');

  const maxPrice = useMemo(() => {
    if (products && products.length > 0) {
      return Math.ceil(Math.max(...products.map(p => p.price)));
    }
    return 1000;
  }, [products]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

  const [sortOption, setSortOption] = useState(queryParams.get('sort') || 'best-sellers');
  const [showFilters, setShowFilters] = useState(false);

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

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    setPriceRange(prev => ({ ...prev, [type]: value === '' ? '' : parseFloat(value) }));
  };

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

  const FilterPanel = () => (
    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:sticky top-24 self-start`}>
      <div className="bg-white p-5 rounded-lg shadow-md space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => handleCategoryChange('all')} className={`w-full text-left ${currentCategory === 'all' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
                All Categories
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button onClick={() => handleCategoryChange(cat.name)} className={`w-full text-left ${currentCategory === cat.name ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Price Range</h3>
          <div className="flex items-center space-x-2">
            <input type="number" value={priceRange.min} onChange={(e) => handlePriceChange(e, 'min')} placeholder="Min" className="w-full p-2 border rounded-md" />
            <span>-</span>
            <input type="number" value={priceRange.max} onChange={(e) => handlePriceChange(e, 'max')} placeholder="Max" className="w-full p-2 border rounded-md" />
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 rounded-md bg-gray-200">
          <FaFilter />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterPanel />
        <main className="flex-1">
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
            <div className="text-center py-10">Loading products...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">No products match your criteria.</div>
          )}
        </main>
      </div>
      <ScrollToTopButton />
    </motion.div>
  );
};

export default Products;