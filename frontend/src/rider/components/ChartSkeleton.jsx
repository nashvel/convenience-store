import React from 'react';

const ChartSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="flex items-end space-x-4 h-64">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-1/12 h-full bg-gray-200 rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;
