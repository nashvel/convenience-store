import React, { useContext, useState, useEffect } from 'react';
import api from '../../api/axios-config';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import { useSettings } from '../../context/SettingsContext';
import { FaStar, FaShoppingBag, FaArrowRight, FaStore, FaMobileAlt, FaDownload, FaRegNewspaper } from 'react-icons/fa';
import ProductCard from '../../components/Cards/ProductCard';
import { LOGO_ASSET_URL } from '../../config';
import NashSvg from '../../assets/nash.svg';
import slugify from '../../utils/slugify';
import ProductCardSkeleton from '../../components/Skeletons/ProductCardSkeleton';
import StoreCardSkeleton from '../../components/Skeletons/StoreCardSkeleton';
import RestaurantBanner from '../../components/Banners/RestaurantBanner';
import PromoBanner from '../../components/Banners/PromoBanner';
import PromoBannerSkeleton from '../../components/Skeletons/PromoBannerSkeleton';
import Avatar from '../../components/Avatar/Avatar';

const Home = () => {
  const navigate = useNavigate();
  const { allProducts, stores, loading, error, categories } = useContext(StoreContext);
  const { settings } = useSettings();
  const [promotions, setPromotions] = useState([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/promotions/active');
        setPromotions(response.data);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setPromotionsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleGetAppClick = (e) => {
    e.preventDefault();
    const section = document.getElementById('mobileapp');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      navigate('/#mobileapp', { replace: true });
    }
  };

  const featuredProducts = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 10);
  const convenienceStores = stores.filter(store => store.store_type === 'convenience');
  const restaurants = stores.filter(store => store.store_type === 'restaurant');

  const categoryImageMap = {
    'Books': '/images/cards/books.png',
    'Electronics': '/images/cards/electronics.png',
    'Fashion': '/images/cards/fashion.png',
    'Foods': '/images/cards/foods.png',
    'Home & Kitchen': '/images/cards/homeandkitchen.png',
    'Sports & Outdoor': '/images/cards/sportsandoutdoor.png',
  };

  const brands = [
    { name: 'Adidas', logo: '/images/brand/adidas.png' },
    { name: 'Apple', logo: '/images/brand/apple.png' },
    { name: 'H&M', logo: '/images/brand/h&m.png' },
    { name: 'Levis', logo: '/images/brand/levis.png' },
    { name: 'LG', logo: '/images/brand/lg.png' },
    { name: 'Nike', logo: '/images/brand/nike.png' },
    { name: 'Puma', logo: '/images/brand/puma.png' },
    { name: 'Samsung', logo: '/images/brand/samsung.png' },
    { name: 'Penshopee', logo: '/images/brand/penshopee.png' },
    { name: 'Ciaobella', logo: '/images/brand/ciaobella.png' }
  ];

  const femaleWearsCategory = categories.flatMap(c => c.children).find(child => child.name.toLowerCase() === 'females wear');
  const femaleWearsProducts = femaleWearsCategory 
    ? allProducts.filter(p => p.category_id === femaleWearsCategory.id).slice(0, 6)
    : [];

  const bannerText = settings.main_banner_text || 'Your Everyday Essentials, Delivered.';
  const appDescription = settings.app_description || 'Quick and Easy Shopping at Your Fingertips. Order your favorite convenience store items with just a few clicks.';

  let bannerPart1 = bannerText;
  let bannerPart2 = '';
  const middleIndex = Math.floor(bannerText.length / 2);
  const splitIndex = bannerText.indexOf(' ', middleIndex);

  if (splitIndex !== -1) {
    bannerPart1 = bannerText.substring(0, splitIndex);
    bannerPart2 = bannerText.substring(splitIndex);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
        {/* Hero Skeleton */}
        <section className="grid md:grid-cols-5 items-center gap-6 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <div className="h-14 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-8"></div>
            <div className="h-6 bg-gray-300 rounded w-5/6 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
              <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
              <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-lg shadow-lg w-full h-96 bg-gray-300"></div>
          </div>
        </section>
        
        {/* Restaurant Banner Skeleton */}
        <RestaurantBanner restaurants={restaurants.slice(0, 5)} />

        {promotionsLoading ? <PromoBannerSkeleton /> : promotions.length > 0 && <PromoBanner promotions={promotions} />}

        {/* Featured Products Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-300 rounded-lg aspect-square"></div>
                ))}
            </div>
        </section>

        {/* Stores Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
          </div>
        </section>

        {/* Restaurants Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <StoreCardSkeleton key={i} />)}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-[calc(100vh-80px)] text-red-500">{error}</div>;
  }

  const buttonBaseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonClasses = `${buttonBaseClasses} bg-primary text-white hover:bg-primary-dark focus:ring-primary`;
  const secondaryButtonClasses = `${buttonBaseClasses} bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary`;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="grid md:grid-cols-5 items-center gap-6 mb-12 md:mb-16">
        <div className="md:col-span-3 md:order-1 text-center md:text-left">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold leading-tight animate-fade-in-down"
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-primary">{bannerPart1}</span>
            <span className="text-gray-800 dark:text-white">{bannerPart2}</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mt-4 mb-8"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
          >
            {appDescription}
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center md:justify-start"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to={categories.length > 0 ? `/products?category=${categories[0].name}` : '/products'} className={primaryButtonClasses}>
              Shop Now <FaArrowRight className="ml-2" />
            </Link>
            <button onClick={handleGetAppClick} className={secondaryButtonClasses}>
              Get the App <FaDownload className="ml-2" />
            </button>
            <Link to="/patch-notes" className={secondaryButtonClasses}>
              Patch Notes <FaRegNewspaper className="ml-2" />
            </Link>
          </motion.div>
        </div>
        <div className="md:col-span-2 md:order-2">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <img src="images\cards\logo.png" alt="Convenience Store" className="rounded-lg shadow-lg w-full h-auto" />
          </motion.div>
        </div>
      </section>

            {/* Banners Section */}
            <section className="relative z-0 grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12 md:mb-16">
                                <div className="h-full lg:col-span-3">
          <RestaurantBanner bannerUrl={settings.restaurant_banner_url} text={settings.restaurant_banner_text} />
        </div>
                                                <div className="h-full lg:col-span-2">
          <PromoBanner promotions={promotions} />
        </div>
      </section>

      {/* Brands Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Brands</h2>
          <Link to="/brands" className="text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar">
            {brands.map((brand) => (
              <motion.div key={brand.name} className="flex-shrink-0 text-center" whileHover={{ y: -5 }}>
                <Link to={`/products?brand=${brand.name}`} className="group">
                  <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center transition-shadow duration-300 group-hover:shadow-lg">
                    <img src={brand.logo} alt={brand.name} className="h-12 object-contain" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Female Wears Section */}
      {femaleWearsProducts.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Female Wears</h2>
            <Link to={`/products?category=${encodeURIComponent(femaleWearsCategory.name)}`} className="text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {femaleWearsProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaStar className="text-yellow-400"/> Featured Products</h2>
          <Link to="/products" className="text-primary font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
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
              <Link to={`/products?category=${category.name}`} className="group flex flex-col bg-white rounded-lg shadow transition-shadow duration-300 hover:shadow-lg overflow-hidden h-full">
                <div className="relative h-40 w-full overflow-hidden">
                  <img 
                    src={categoryImageMap[category.name] || '/images/cards/card-01.png'} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center flex-grow flex items-center justify-center">
                  <h3 className="font-semibold text-gray-700">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {convenienceStores && convenienceStores.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaStore className="text-primary" /> Shop by Store</h2>
            <Link to="/stores" className="text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {convenienceStores.slice(0, 6).map((store) => (
              <motion.div key={store.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Link to={`/stores/${store.id}/${slugify(store.name)}`} className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-5 text-center transition-shadow duration-300 hover:shadow-lg h-full">
                  <Avatar user={{ name: store.name, avatar_url: store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : null }} className="w-20 h-20 rounded-lg mb-4 object-contain" textSize="text-2xl" />
                  <h3 className="font-semibold text-gray-700">{store.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FaShoppingBag className="text-primary" /> Order Food</h2>
            <Link to="/restaurants" className="text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {restaurants.slice(0, 6).map((store) => (
              <motion.div key={store.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Link to={`/stores/${store.id}/${slugify(store.name)}`} className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-5 text-center transition-shadow duration-300 hover:shadow-lg h-full">
                  <Avatar user={{ name: store.name, avatar_url: store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : null }} className="w-20 h-20 rounded-lg mb-4 object-contain" textSize="text-2xl" />
                  <h3 className="font-semibold text-gray-700">{store.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-3 gap-8 mb-16">
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
        <div className="bg-red-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Hot Meals</h3>
            <p className="text-gray-600 mb-4">Delicious food from local restaurants.</p>
            <Link to="/restaurants" className={`${primaryButtonClasses} text-sm`}>Browse Food</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Hot Meals" className="w-full md:w-48 h-48 object-cover" />
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