import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center p-8 md:p-16 bg-gray-50 rounded-xl"
    >
      <FaShoppingCart className="mx-auto h-20 w-20 text-gray-300" />
      <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
      <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
      <Link
        to="/products"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
      >
        Start Shopping <FaArrowRight />
      </Link>
    </motion.div>
  );
};

export default EmptyCart;
