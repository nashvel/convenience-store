import React from 'react';

const MyOrderDetailSkeleton = () => {
  const SkeletonItem = () => (
    <div className="flex justify-between items-center p-3 bg-gray-200 rounded-lg">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
        <div className="h-5 bg-gray-300 rounded w-40"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-20"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto my-20 p-8 bg-white rounded-xl shadow-lg animate-pulse">
      <div className="inline-block mb-6 h-10 w-40 bg-gray-300 rounded-lg"></div>
      <div className="h-9 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
      </div>

      <div className="mt-8 mb-4 pb-2 border-b-2 border-gray-200">
        <div className="h-7 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </div>

      <div className="mt-8 flex gap-4">
        <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default MyOrderDetailSkeleton;
