import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ImageViewerModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-lg max-h-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
        >
          <img src={imageUrl} alt="Product Variant" className="w-full h-auto max-h-[90vh] object-contain rounded-lg" />
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close image viewer"
          >
            <FaTimes />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageViewerModal;
