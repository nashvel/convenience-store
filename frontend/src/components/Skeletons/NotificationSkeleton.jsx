import React from 'react';

const NotificationSkeleton = () => {
  return (
    <div className="flex items-start p-4 animate-pulse">
      <div className="flex-shrink-0 w-8 text-center pt-1">
        <div className="w-5 h-5 bg-gray-300 rounded-full mx-auto"></div>
      </div>
      <div className="ml-4 flex-grow">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-2 h-2 bg-gray-300 rounded-full self-center ml-4"></div>
    </div>
  );
};

export default NotificationSkeleton;
