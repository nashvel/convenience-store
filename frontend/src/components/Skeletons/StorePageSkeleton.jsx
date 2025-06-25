import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const StorePageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-16 animate-pulse">
      {/* Store Header Skeleton */}
      <div className="relative text-center mb-10 p-16 rounded-lg bg-gray-300">
        <div className="h-12 bg-gray-400 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-400 rounded w-3/4 mx-auto"></div>
      </div>
      
      {/* Address & Actions Skeleton */}
      <div className="flex flex-wrap justify-between items-center bg-gray-200 p-4 rounded-lg shadow-md mb-8 gap-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-300 rounded-md"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Products Title Skeleton */}
      <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>

      {/* Controls Skeleton */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="h-12 bg-gray-300 rounded-lg w-full max-w-md"></div>
        <div className="h-12 bg-gray-300 rounded-lg w-48"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
};

export default StorePageSkeleton;
