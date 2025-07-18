import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios-config';
import ProductCard from '../../components/Cards/ProductCard';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaDirections, FaShareAlt, FaCommentDots, FaStar, FaClock, FaTimesCircle, FaBoxOpen, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LOGO_ASSET_URL } from '../../config';
import StorePageSkeleton from '../../components/Skeletons/StorePageSkeleton';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import ScrollToTopButton from '../../components/ScrollToTop/ScrollToTopButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDebounce } from '../../hooks/useDebounce';

const StorePage = () => {
  const { openChat } = useChat();
  const { user } = useAuth();
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortOption, setSortOption] = useLocalStorage(`store-${storeId}-sort`, 'best-sellers');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const storeResponse = await api.get(`/stores/${storeId}`);
        setStore(storeResponse.data);

        const productResponse = await api.get(`/products?store_id=${storeId}`);
        setProducts(productResponse.data);

      } catch (err) {
        setError('Failed to fetch store data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  const storeProducts = useMemo(() => {
    const filtered = Array.isArray(products) ? products : [];

    let searched = filtered;
    if (debouncedSearchQuery) {
      const lowercasedQuery = debouncedSearchQuery.toLowerCase();
      searched = filtered.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        (p.description && p.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    const sorted = [...searched];
    switch (sortOption) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'best-sellers': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return sorted;
  }, [products, storeId, debouncedSearchQuery, sortOption]);

  const handleSortChange = (newSortOption) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(newSortOption);
      setIsSorting(false);
    }, 300); // Simulate loading for better UX
  };

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
    <div className="pt-20 pb-10 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Link to="/stores" className="inline-flex items-center gap-2 text-sm text-gray-600 font-semibold hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Back to All Stores
        </Link>
      </div>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-md mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 text-gray-800 font-semibold text-lg">
            <FaMapMarkerAlt className="text-primary mt-1" />
            <span>{store.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-gray-600">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400" />
              <span className="font-bold text-gray-800">{store.rating?.toFixed(1) || 'New'}</span>
              <span className="text-sm">({store.num_reviews || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaClock className="text-gray-400" />
              <span className="text-sm">Open until 9:00 PM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
          <button onClick={handleShare} title="Copy link" aria-label="Share store link" className="flex items-center justify-center bg-gray-200 text-gray-700 h-10 w-10 rounded-full transition-all duration-200 hover:bg-gray-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            <FaShareAlt />
          </button>
          <button 
            onClick={() => {
              if (!user) {
                toast.warn('Please log in to chat with the store.');
                return;
              }

              if (user.role !== 'customer') {
                toast.warn('Only customers can use this feature.');
                return;
              }

              const recipientId = store?.owner?.id;
              if (user.id === recipientId) {
                toast.info("You can't open a chat with your own store.");
                return;
              }

              if (recipientId) {
                const chatRecipient = {
                  ...store.owner,
                  name: store.name, // Use store's name for chat display
                  first_name: store.name, // Legacy support
                  last_name: '',
                  avatar: store.logo,
                  name: store.name, // Use store's name for chat display
                };
                openChat(chatRecipient);
              } else {
                console.error('Store owner ID not available, cannot initiate chat.');
                toast.error('Messaging is not available for this store.');
              }
            }}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaCommentDots /> Message
          </button>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaDirections /> Get Directions
          </a>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-primary">Products</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="relative flex-grow max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
                    <input
            type="text"
            placeholder="Search products in this store..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimesCircle />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={sortOption} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-primary focus:border-primary"
          >
            <option value="best-sellers">Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

                        <div className="relative min-h-[400px]">
        {isSorting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
            <FaSpinner className="animate-spin text-primary text-5xl" />
          </div>
        )}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-all duration-300 ${isSorting ? 'blur-sm opacity-50' : ''}`}>
          {storeProducts.length > 0 ? (
            storeProducts.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-16 px-6 bg-gray-50 rounded-lg">
              <FaBoxOpen className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
              <p className="text-gray-500 mt-2">This store hasn't listed any products yet. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
      </motion.div>
    </div>
  );
};

export default StorePage;
