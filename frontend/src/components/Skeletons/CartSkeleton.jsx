import React from 'react';

const CartSkeleton = () => {
  const SkeletonCartItem = () => (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
      <div className="flex-grow space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
        <div className="h-5 w-5 bg-gray-300 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-24"></div>
      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
    </div>
  );

  return (
    <div className="container mx-auto mt-10 mb-20 p-4 md:p-8 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-10"></div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Store Group Skeleton */}
          <div className="space-y-4">
            <div className="h-7 bg-gray-300 rounded w-1/3"></div>
            <SkeletonCartItem />
            <SkeletonCartItem />
          </div>
          {/* Another Store Group Skeleton */}
          <div className="space-y-4 pt-6 border-t">
            <div className="h-7 bg-gray-300 rounded w-1/4"></div>
            <SkeletonCartItem />
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-gray-200 rounded-lg shadow-md p-6 sticky top-24">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 bg-gray-300 rounded w-1/5"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <div className="h-7 bg-gray-300 rounded w-1/4"></div>
              <div className="h-7 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
          <div className="w-full mt-6 h-12 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div className="h-6 bg-gray-300 rounded w-40"></div>
        <div className="h-6 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
};

export default CartSkeleton;
