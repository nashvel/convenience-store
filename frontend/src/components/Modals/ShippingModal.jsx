import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShippingFast, FaStore } from 'react-icons/fa';

const ShippingModal = ({ isOpen, onClose, selectedOption, onSelect }) => {
  if (!isOpen) return null;

  const options = [
    { id: 'door_to_door', label: 'Door-to-door Delivery', icon: <FaShippingFast /> },
    { id: 'pick_up', label: 'Pick-up at Store', icon: <FaStore /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Select Shipping Option</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {options.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOption === option.id ? 'border-primary bg-primary-light' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingOption"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => {
                          onSelect(option.id);
                          onClose();
                      }}
                      className="sr-only"
                    />
                    <div className="text-primary mr-4 text-xl">{option.icon}</div>
                    <span className="font-semibold">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShippingModal;
