import React from 'react';

const PatchNotesSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6 animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-gray-300 rounded-full w-20"></div>
        <div className="h-5 bg-gray-300 rounded-full w-20"></div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-28 mt-4"></div>
    </div>
  );
};

export default PatchNotesSkeleton;
