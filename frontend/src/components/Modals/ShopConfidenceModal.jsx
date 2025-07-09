import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeadset, FaUndo, FaRegTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

const ShopConfidenceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const services = [
    {
      icon: <FaUndo className="text-green-500" />,
      title: 'Free 6-day Returns',
      description: 'Free return within 6 days of receiving your product. Terms & Conditions applied.',
    },
    {
      icon: <FaRegTimesCircle className="text-green-500" />,
      title: 'Easy Cancellation',
      description: 'Cancel your order instantly with no questions asked before the item is ready to be shipped.',
      learnMore: true,
    },
    {
      icon: <FaHeadset className="text-green-500" />,
      title: 'EcomXpert Support',
      description: 'Dedicated Customer Service to ensure you have a great shopping experience.',
      learnMore: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100vh', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaHeadset className="text-2xl text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">Shop with confidence</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Services</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaMoneyBillWave className="text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Cash on delivery available</p>
                    </div>
                  </div>
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1">{service.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-700">{service.title}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                        {service.learnMore && <Link to={`/help-center#${service.title.toLowerCase().replace(/ /g, '-')}`} onClick={onClose} className="text-sm text-blue-600 hover:underline">Learn more</Link>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Return policy</h3>
                <div className="flex items-start gap-4">
                  <div className="mt-1"><FaUndo className="text-green-500" /></div>
                  <div>
                    <p className="font-semibold text-gray-700">Return within 6 days</p>
                    <p className="text-sm text-gray-500">A 6-day return guarantee is applied to faulty EcomXpert products.</p>
                    <Link to="/help-center#returns" onClick={onClose} className="text-sm text-blue-600 hover:underline">Learn more</Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShopConfidenceModal;
