import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Redirect to home or orders page after a few seconds
    const timer = setTimeout(() => {
      // navigate('/my-orders');
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-lg w-full border-t-4 border-blue-500"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 120 }}
          className="mx-auto mb-6 w-24 h-24 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
        >
          <FaCheckCircle className="text-white text-6xl" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Thank You!</h1>
        <p className="text-gray-600 text-lg mb-8">Your order has been placed successfully.</p>

        <p className="text-gray-500 text-sm mb-8">
          You will receive an email confirmation shortly. You can also track your order status in your account.
        </p>

        <Link
          to="/my-orders"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Go to My Orders
          <FaArrowRight />
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
