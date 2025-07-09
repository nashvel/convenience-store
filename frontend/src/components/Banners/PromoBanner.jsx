import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const banners = [
  { id: 1, src: '/images/cards/discountcard.png', alt: 'Promotion Banner' },
  { id: 2, src: '/images/cards/foodsale.png', alt: 'Food Sale' },
  { id: 3, src: '/images/cards/flashsale.png', alt: 'Flash Sale' },
];

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

const PromoBanner = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = Math.abs(page % banners.length);

  const paginate = useCallback((newDirection) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 3000); // 3 seconds

    return () => {
      clearInterval(timer);
    };
  }, [paginate]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-100">
      <AnimatePresence initial={false} custom={direction}>
              <Link to="/promotions" className="block w-full h-full">
        <motion.img
          key={page}
          src={banners[imageIndex].src}
          alt={banners[imageIndex].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
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
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${i === imageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
