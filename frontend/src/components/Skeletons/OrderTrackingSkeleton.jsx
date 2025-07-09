import React from 'react';

const OrderTrackingSkeleton = () => {
  return (
    <div className="container mx-auto my-10 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Map Skeleton */}
        <div className="md:col-span-2 h-96 bg-gray-300 rounded-lg animate-pulse"></div>

        {/* Details Skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Back button skeleton */}
          <div className="h-10 w-40 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
          
          {/* Title skeleton */}
          <div className="h-8 w-3/4 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>

          {/* Tracking steps skeleton */}
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-300"></div>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center mb-8">
                <div className="z-10 w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="ml-6 w-full">
                  <div className="h-5 w-1/2 bg-gray-300 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingSkeleton;
