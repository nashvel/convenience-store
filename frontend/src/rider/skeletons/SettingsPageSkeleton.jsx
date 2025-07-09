import React from 'react';

const SettingsPageSkeleton = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="h-7 bg-gray-300 rounded w-1/3 mb-6"></div>
      
      <div className="space-y-6">
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded-lg w-32 mt-6"></div>
      </div>

    </div>
  );
};

export default SettingsPageSkeleton;
