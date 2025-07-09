import React from 'react';

const MapSkeleton = () => {
  return (
    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 dark:text-gray-500">Loading Map...</p>
      </div>
    </div>
  );
};

export default MapSkeleton;
