import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCompass } from 'react-icons/fa';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4"
    >
      <div className="max-w-md">
        <motion.div
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl text-primary mx-auto mb-6 w-min"
        >
          <FaCompass />
        </motion.div>

        <motion.h1 
          className="text-9xl font-extrabold text-primary tracking-tighter"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          404
        </motion.h1>

        <h2 className="mt-4 text-4xl font-bold text-gray-800">Lost in Space?</h2>
        <p className="mt-4 text-lg text-gray-600">
          It seems you've ventured into uncharted territory. Let's get you back on track.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          <Link 
            to="/"
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-light"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;

