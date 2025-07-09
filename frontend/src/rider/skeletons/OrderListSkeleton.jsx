import React from 'react';

const SkeletonRow = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 animate-pulse">
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
  </div>
);

const OrderListSkeleton = ({ count = 5 }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
            <SkeletonRow key={index} />
        ))}
        </div>
    </div>
  );
};

export default OrderListSkeleton;
