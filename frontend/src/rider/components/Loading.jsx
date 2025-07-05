import React from 'react';

const Loading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Map Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex items-end justify-between h-64">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-1/12 bg-gray-200 rounded-t-lg" style={{ height: `${Math.random() * 80 + 15}%` }}></div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="h-7 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Order List Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <div className="h-7 bg-gray-200 rounded w-1/3"></div>
            <div className="flex space-x-4">
                <div className="h-9 bg-gray-200 rounded w-32"></div>
                <div className="h-9 bg-gray-200 rounded w-32"></div>
            </div>
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-9 bg-blue-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
