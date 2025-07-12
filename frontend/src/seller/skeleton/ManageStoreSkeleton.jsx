import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const ManageStoreSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="mb-6">
                <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
            <div className="flex justify-end mt-6">
                <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
};

export default ManageStoreSkeleton;
