import React from 'react';
import ChartSkeleton from '../components/ChartSkeleton';
import MapSkeleton from './MapSkeleton';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl h-24"></div>
        ))}
      </div>

      {/* Performance Chart and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 lg:p-6 rounded-xl h-full min-h-[300px]">
            <ChartSkeleton />
          </div>
        </div>
        <div className="lg:col-span-2 h-80 lg:h-auto">
          <MapSkeleton />
        </div>
      </div>

      {/* My Assigned Deliveries */}
      <div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl h-28"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
