import React from 'react';

const SellerDashboardSkeleton = () => {
    const StatCardSkeleton = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                    <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );

    const ChartSkeleton = () => (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );

    const RecentOrdersSkeleton = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                        <div className="flex-grow">
                            <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded mt-1"></div>
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartSkeleton />
                <RecentOrdersSkeleton />
            </div>
        </div>
    );
};

export default SellerDashboardSkeleton;
