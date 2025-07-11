import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTag, FaInfoCircle, FaArrowRight, FaCalendarAlt, FaStoreAlt, FaTags, FaGift } from 'react-icons/fa';
import api from '../../api/axios-config';
import Spinner from '../../components/Spinner/Spinner';

const typeIcons = {
  store: <FaStoreAlt className="mr-2 text-gray-500" />,
  category: <FaTag className="mr-2 text-gray-500" />,
  all_products: <FaTags className="mr-2 text-gray-500" />,
};

const getPromotionLink = (promo) => {
    switch (promo.scope_type) {
        case 'store':
            // Assuming a route like /stores/:storeId exists
            return `/stores/${promo.scope_value}`;
        case 'category':
            return `/products?category=${promo.scope_value}`;
        case 'all_products':
        default:
            return '/products';
    }
};

const PromotionCard = ({ promotion, index }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative">
      <img src={promotion.image_url || '/images/cards/flashsale.png'} alt={promotion.title} className="w-full h-56 object-cover" />
      <div className={`absolute top-0 right-0 mt-4 mr-4 px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full shadow-md`}>
        <FaGift className="inline-block mr-2" />{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : ' OFF'}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">{promotion.title}</h3>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <p className="text-gray-600 mb-4 flex-grow">{promotion.description}</p>
      
      <div className="space-y-3 text-sm text-gray-700 mb-4 border-t border-gray-100 pt-4">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <span>Expires on: <strong>{new Date(promotion.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
        <div className="flex items-center capitalize">
          {typeIcons[promotion.scope_type]}
          <span>Applies to: <strong>{promotion.scope_value || promotion.scope_type.replace('_', ' ')}</strong></span>
        </div>
      </div>

      <Link to={getPromotionLink(promotion)} className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 mt-auto">
        Shop Now <FaArrowRight className="ml-2" />
      </Link>
    </div>
  </motion.div>
);

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/promotions/active');
        setPromotions(response.data.promotions || response.data || []);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
        // Optionally set an error state here to show in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Today's Hottest Promotions</h1>
        <p className="text-lg text-gray-500 mb-12 text-center max-w-3xl mx-auto">
          Don't miss out on these exclusive deals! We've curated the best offers just for you. Click on any promotion to start shopping.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <PromotionCard key={promo.id} promotion={promo} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <FaTag className="mx-auto text-5xl text-gray-300"/>
            <h2 className="mt-4 text-2xl font-bold text-gray-700">No Active Promotions</h2>
            <p className="mt-2 text-gray-500">Check back later for new deals and offers!</p>
        </div>
      )}

      <div className="mt-16 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex">
          <div className="py-1">
            <FaInfoCircle className="h-6 w-6 text-blue-500 mr-4" />
          </div>
          <div>
            <p className="font-bold text-blue-800">Terms & Conditions</p>
            <p className="text-sm text-blue-700">
              All promotions are valid for a limited time only and subject to availability. Prices are as marked. See individual product pages for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
