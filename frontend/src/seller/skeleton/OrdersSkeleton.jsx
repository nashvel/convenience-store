import React from 'react';

const OrdersSkeleton = () => {
    const SkeletonOrderCard = () => (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="border-t border-gray-100 pt-4">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div className="w-2/3 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-pulse">
            <div className="mb-6">
                <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonOrderCard key={i} />)}
            </div>
        </div>
    );
};

export default OrdersSkeleton;
