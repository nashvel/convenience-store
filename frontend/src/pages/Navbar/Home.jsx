import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { FaStar, FaShoppingBag, FaArrowRight, FaStore, FaMobileAlt, FaDownload } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import { LOGO_ASSET_URL } from '../../config';
import NashSvg from '../../assets/nash.svg';
import slugify from '../../utils/slugify';

const Home = () => {
  const navigate = useNavigate();
  const { allProducts, stores, loading, error, categories } = useContext(StoreContext);

  const handleGetAppClick = (e) => {
    e.preventDefault();
    const section = document.getElementById('mobileapp');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      navigate('/#mobileapp', { replace: true });
    }
  };

  const featuredProducts = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 4);

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-80px)]">Loading products...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-[calc(100vh-80px)] text-red-500">{error}</div>;
  }

  const buttonBaseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClasses = `${buttonBaseClasses} bg-primary text-white hover:bg-primary-dark focus:ring-primary`;
  const secondaryButtonClasses = `${buttonBaseClasses} bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary`;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="grid md:grid-cols-2 items-center gap-12 mb-20 md:mb-24">
        <div className="md:order-1 text-center md:text-left">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-gray-800"
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          >
            Quick and Easy <span className="text-primary">Shopping</span> at Your Fingertips
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
          >
            Order your favorite convenience store items with just a few clicks.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center md:justify-start"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to={categories.length > 0 ? `/products?category=${categories[0].name}` : '/products'} className={primaryButtonClasses}>
              Shop Now <FaArrowRight />
            </Link>
            <button onClick={handleGetAppClick} className={secondaryButtonClasses}>
              Get the App <FaDownload />
            </button>
          </motion.div>
        </div>
        <motion.div 
          className="md:order-2"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Convenience Store" className="rounded-lg shadow-lg w-full h-auto" />
        </motion.div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaStar className="text-yellow-400"/> Featured Products</h2>
          <Link to="/products" className="text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaShoppingBag className="text-primary" /> Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <motion.div key={category.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Link to={`/products?category=${category.name}`} className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-5 text-center transition-shadow duration-300 hover:shadow-lg">
                <i className={`fa fa-${category.icon} text-3xl text-primary mb-3`}></i>
                <h3 className="font-semibold text-gray-700">{category.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {stores && stores.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaStore className="text-primary" /> Shop by Store</h2>
            <Link to="/stores" className="text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stores.slice(0, 6).map((store) => (
              <motion.div key={store.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Link to={`/store/${store.id}/${slugify(store.name)}`} className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-5 text-center transition-shadow duration-300 hover:shadow-lg h-full">
                  <img src={`${LOGO_ASSET_URL}/${store.logo}`} alt={store.name} className="w-20 h-20 object-contain mb-4" />
                  <h3 className="font-semibold text-gray-700">{store.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-cyan-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Fresh Groceries</h3>
            <p className="text-gray-600 mb-4">Delivered to your door in minutes.</p>
            <Link to="/products?category=Groceries" className={`${primaryButtonClasses} text-sm`}>Shop Now</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Groceries" className="w-full md:w-48 h-48 object-cover" />
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Snacks & Drinks</h3>
            <p className="text-gray-600 mb-4">Your favorite treats, ready to enjoy.</p>
            <Link to="/products?category=Snacks" className={`${primaryButtonClasses} text-sm`}>Order Now</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1551024601-bec78d8d590d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Snacks" className="w-full md:w-48 h-48 object-cover" />
        </div>
      </section>

      <section id="mobileapp" className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4"><FaMobileAlt className="text-primary"/> Get Our App!</h2>
          <p className="text-lg text-gray-600">Experience seamless shopping on the go. Download the Nash app for exclusive deals and faster checkout.</p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-105">
              <img src="/google-play-badge.png" alt="Get it on Google Play" className="h-12" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-105">
              <img src="/app-store-badge.png" alt="Download on the App Store" className="h-12" />
            </a>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <img src={NashSvg} alt="Nash App" className="w-64 h-auto" />
        </div>
      </section>

    </motion.div>
  );
};

export default Home;