import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="p-4 rounded-full bg-gray-200 h-16 w-16"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
    <div className="mt-4 animate-pulse">
      <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
    </div>
  </div>
);

const AchievementSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default AchievementSkeleton;
