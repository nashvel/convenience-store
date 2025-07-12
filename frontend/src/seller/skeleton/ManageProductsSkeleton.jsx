import React from 'react';

const ManageProductsSkeleton = () => {
    const SkeletonRow = () => (
        <tr className="border-b border-gray-200">
            <td className="py-4 px-6">
                <div className="h-16 w-16 bg-gray-200 rounded"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td className="py-4 px-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4 flex justify-between items-center">
                <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5"><div className="h-4 w-1/2 bg-gray-200 rounded"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProductsSkeleton;
