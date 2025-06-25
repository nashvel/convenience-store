import React from 'react';

const OrderListSkeleton = () => {
  const SkeletonRow = () => (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="p-4"><div className="h-6 bg-gray-300 rounded w-16"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-300 rounded w-24"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-300 rounded w-20"></div></td>
      <td className="p-4"><div className="h-6 bg-gray-300 rounded-full w-24"></div></td>
      <td className="p-4 text-right"><div className="h-10 bg-gray-300 rounded-lg w-28 ml-auto"></div></td>
    </tr>
  );

  return (
    <div className="max-w-4xl mx-auto my-20 p-6 bg-white rounded-xl shadow-lg animate-pulse">
      <div className="h-9 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-4 font-semibold w-1/5"><div className="h-6 bg-gray-300 rounded"></div></th>
              <th className="p-4 font-semibold w-1/5"><div className="h-6 bg-gray-300 rounded"></div></th>
              <th className="p-4 font-semibold w-1/5"><div className="h-6 bg-gray-300 rounded"></div></th>
              <th className="p-4 font-semibold w-1/5"><div className="h-6 bg-gray-300 rounded"></div></th>
              <th className="p-4 w-1/5"></th>
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

export default OrderListSkeleton;
