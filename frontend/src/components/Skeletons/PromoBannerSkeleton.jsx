import React from 'react';

const PromoBannerSkeleton = () => {
  return (
    <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg animate-pulse mb-12 md:mb-16">
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-full w-10 h-10"></div>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-full w-10 h-10"></div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>
  );
};

export default PromoBannerSkeleton;
