import React from 'react';

const StoreCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-md animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
  );
};

export default StoreCardSkeleton;
