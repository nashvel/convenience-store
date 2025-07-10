import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';



const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const PromoBanner = ({ promotions }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback((newDirection) => {
    if (promotions && promotions.length > 1) {
      setPage(prevPage => [prevPage[0] + newDirection, newDirection]);
    }
  }, [promotions]);

  useEffect(() => {
    if (promotions && promotions.length > 1) {
      const timer = setInterval(() => {
        paginate(1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [promotions, paginate]);

  // Guard against rendering with no data. This is now placed after the hooks.
  if (!promotions || promotions.length === 0) {
    return null;
  }

  // This calculation is now safe because we've confirmed promotions exist.
  const imageIndex = Math.abs(page % promotions.length);

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
      <AnimatePresence initial={false} custom={direction}>
        <Link to="/promotions" className="block w-full h-full">
          <motion.img
            key={page} // Key change triggers the animation
            src={promotions[imageIndex].image_url}
            alt={promotions[imageIndex].title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag={promotions.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              // Disable drag functionality completely if there's only one promotion
              if (promotions.length <= 1) return;

              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full object-cover"
          />
        </Link>
      </AnimatePresence>

      {/* Only show navigation controls if there is more than one promotion */}
      {promotions.length > 1 && (
        <>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
            <button onClick={() => paginate(-1)} className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
              <FaChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
            <button onClick={() => paginate(1)} className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
              <FaChevronRight size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
            {promotions.map((_, i) => (
              <div
                key={i}
                onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${i === imageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoBanner;
