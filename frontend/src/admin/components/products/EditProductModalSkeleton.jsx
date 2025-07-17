import React from 'react';

const EditProductModalSkeleton = () => {
  return (
    <div className="bg-blue-50 p-8 rounded-xl shadow-2xl w-full max-w-3xl animate-fade-in-up relative">
      <div className="flex justify-between items-center pb-4 border-b border-blue-200 mb-6">
        <div className="h-8 bg-gray-300 rounded-md w-1/3 animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name and Category */}
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="h-11 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="h-11 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="h-24 bg-gray-300 rounded-2xl animate-pulse"></div>
          </div>

          {/* Price and Stock */}
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="h-11 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="h-11 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Product Image */}
          <div className="md:col-span-2">
            <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-1 animate-pulse"></div>
            <div className="mt-2 flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-300 rounded-lg animate-pulse flex-shrink-0"></div>
              <div className="w-full h-32 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 flex justify-end gap-4 border-t border-blue-100">
          <div className="h-11 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="h-11 w-32 bg-gray-400 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModalSkeleton;
