import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gray-300"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-9 bg-gray-300 rounded-lg w-24 mt-2"></div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 h-28"><div className="h-full bg-gray-200 rounded"></div></div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 h-28"><div className="h-full bg-gray-200 rounded"></div></div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 h-28"><div className="h-full bg-gray-200 rounded"></div></div>
      </div>

      {/* Achievements Preview */}
      <div className="mb-8">
        <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 h-24"><div className="h-full bg-gray-200 rounded"></div></div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 h-24"><div className="h-full bg-gray-200 rounded"></div></div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 h-24"><div className="h-full bg-gray-200 rounded"></div></div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 h-24"><div className="h-full bg-gray-200 rounded"></div></div>
        </div>
      </div>

      {/* Settings */}
      <div>
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            <div className="h-14 bg-gray-200"></div>
            <div className="h-14 bg-gray-200"></div>
            <div className="h-14 bg-gray-200"></div>
            <div className="h-14 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
