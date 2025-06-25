import React from 'react';

const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg bg-gray-300 w-full aspect-square"></div>
        
        <div className="flex flex-col">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
          
          <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
          
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-5"></div>
          
          <div className="flex items-center gap-1 mb-5">
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
          
          <hr className="my-5"/>
          
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="h-14 bg-gray-300 rounded-lg w-40"></div>
            <div className="h-14 bg-gray-300 rounded-lg flex-1"></div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

        </div>
      </div>

      <div className="mt-16">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-40 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetailsSkeleton;
