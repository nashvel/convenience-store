import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full animate-pulse">
      <div className="relative h-32 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
