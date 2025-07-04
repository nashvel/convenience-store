import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTag, FaInfoCircle, FaArrowRight, FaCalendarAlt, FaStoreAlt, FaTags } from 'react-icons/fa';

const promotions = [
  {
    id: 1,
    title: '7.7 Flash Sale',
    description: 'Up to 70% off on selected items. Don\'t miss out on our biggest sale of the season!',
    image: '/images/cards/flashsale.png',
    link: '/products?tag=flash-sale',
    badge: 'Limited Time',
    bgColor: 'bg-blue-500',
    endDate: '2025-07-10',
    type: 'Sitewide',
    scope: 'Selected Items'
  },
  {
    id: 2,
    title: 'Big Discount on Groceries',
    description: 'Save big on your weekly grocery shopping. Fresh produce, pantry staples, and more.',
    image: '/images/cards/discountcard.png',
    link: '/products?category=groceries',
    badge: 'Weekly Special',
    bgColor: 'bg-green-500',
    endDate: '2025-07-12',
    type: 'Category',
    scope: 'Groceries'
  },
  {
    id: 3,
    title: 'Foodie Fiesta',
    description: 'Delicious deals on your favorite snacks and meals. Perfect for a treat!',
    image: '/images/cards/foodsale.png',
    link: '/products?category=food',
    badge: 'Hot Deal',
    bgColor: 'bg-red-500',
    endDate: '2025-07-15',
    type: 'Category',
    scope: 'Food & Snacks'
  },
  {
    id: 4,
    title: 'Electronics Extravaganza',
    description: 'Get the latest gadgets at unbeatable prices. Laptops, phones, and accessories.',
    image: '/images/cards/flashsale.png',
    link: '/products?category=electronics',
    badge: 'Tech Deals',
    bgColor: 'bg-purple-500',
    endDate: '2025-07-20',
    type: 'Store',
    scope: 'TechZone Store'
  },
];

const typeIcons = {
  Store: <FaStoreAlt className="mr-2 text-gray-500" />,
  Category: <FaTag className="mr-2 text-gray-500" />,
  Sitewide: <FaTags className="mr-2 text-gray-500" />,
};

const PromotionCard = ({ promotion, index }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative">
      <img src={promotion.image} alt={promotion.title} className="w-full h-56 object-cover" />
      <div className={`absolute top-0 right-0 mt-4 mr-4 px-3 py-1 text-sm font-semibold text-white ${promotion.bgColor} rounded-full shadow-md`}>
        <FaTag className="inline-block mr-2" />{promotion.badge}
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
          <span>Expires on: <strong>{new Date(promotion.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
        <div className="flex items-center">
          {typeIcons[promotion.type]}
          <span>Applies to: <strong>{promotion.scope} ({promotion.type})</strong></span>
        </div>
      </div>

      <Link to={promotion.link} className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 mt-auto">
        Shop Now <FaArrowRight className="ml-2" />
      </Link>
    </div>
  </motion.div>
);


const PromotionsPage = () => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promotions.map((promo, index) => (
          <PromotionCard key={promo.id} promotion={promo} index={index} />
        ))}
      </div>

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
