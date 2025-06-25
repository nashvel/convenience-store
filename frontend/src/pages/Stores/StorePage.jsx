import React, { useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaDirections, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LOGO_ASSET_URL } from '../../config';
import StorePageSkeleton from '../../components/Skeletons/StorePageSkeleton';

const StorePage = () => {
  const { storeId } = useParams();
  const { stores, allProducts: products, loading, error } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('best-sellers');

  const store = useMemo(() => (stores || []).find(s => s.id == storeId), [stores, storeId]);

  const storeProducts = useMemo(() => {
    let filtered = (products || []).filter(p => p.store_id == storeId);
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        (p.description && p.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    const sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'best-sellers': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return sorted;
  }, [products, storeId, searchQuery, sortOption]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link.');
      console.error('Failed to copy: ', err);
    }
  };

  if (loading) return <StorePageSkeleton />;
  if (error) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-red-500">Error: {error}</div>;
  if (!store) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">Store not found.</div>;

  const logoUrl = store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : '';

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <div 
        className="relative text-center mb-10 p-16 rounded-lg overflow-hidden bg-gray-500 bg-blend-multiply"
        style={{ backgroundImage: `url(${logoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{store.name}</h1>
          <p className="text-xl text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>{store.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-md mb-8 gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaMapMarkerAlt className="text-primary" /> {store.address}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} title="Copy link" className="flex items-center justify-center bg-secondary text-white h-10 w-10 rounded-md transition-all duration-200 hover:bg-secondary-dark hover:scale-105">
            <FaShareAlt />
          </button>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200 hover:bg-primary-dark"
          >
            <FaDirections /> Get Directions
          </a>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-primary">Products</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search products in this store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-primary focus:border-primary"
          >
            <option value="best-sellers">Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {storeProducts.length > 0 ? (
          storeProducts.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">This store has no products yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default StorePage;
