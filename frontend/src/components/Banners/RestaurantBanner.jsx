import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// Static assets that are part of the design
const CAT_DELIVERY_URL = '/images/icons/cat.png';
const BURGER_URL = 'https://static.vecteezy.com/system/resources/previews/053/579/154/non_2x/turkish-gyro-wrap-on-black-background-png.png';
const DRINK_URL = 'https://pngimg.com/uploads/cocacola/cocacola_PNG24.png';
const DEFAULT_BANNER_URL = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';

const RestaurantBanner = ({ bannerUrl, text }) => {
  const bannerText = text || 'Explore our Restaurants with a delivery at your fingertips';
  const background = bannerUrl ? `/uploads/${bannerUrl}` : DEFAULT_BANNER_URL;

  return (
    <section className="relative p-6 md:p-10 h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center rounded-2xl"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60 rounded-2xl"></div>
            <div className="relative z-10 md:w-3/5">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {bannerText}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            to="/restaurants" 
            className="inline-flex items-center gap-3 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            View Restaurants <FaArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Images */}
      <div 
        className="absolute -right-20 -bottom-20 w-96 h-96 z-10"
        style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 60%)',
        }}
      ></div>
      <motion.img 
        src={BURGER_URL}
        alt="Gyro Wrap"
        className="absolute -bottom-10 -right-10 w-56 h-56 md:w-80 md:h-80 z-40 opacity-90 transform -rotate-12" 
        initial={{ x: '100%', opacity: 0, rotate: 0 }}
        animate={{ x: 0, opacity: 1, rotate: -12 }}
        transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 50 }}
      />
      <motion.img 
        src={DRINK_URL}
        alt="Cola Drink"
        className="absolute bottom-0 right-64 w-16 h-16 md:w-20 md:h-20 z-30 transform rotate-12" 
        initial={{ y: '100%', opacity: 0, rotate: 0 }}
        animate={{ y: 0, opacity: 1, rotate: 12 }}
        transition={{ duration: 0.8, delay: 0.7, type: 'spring', stiffness: 50 }}
      />
      <img 
        src={CAT_DELIVERY_URL}
        alt="Cat"
        className="absolute bottom-2 left-[40%] w-20 h-20 z-20"
      />


    </section>
  );
};

export default RestaurantBanner;
