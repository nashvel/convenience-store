import React, { useState, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, CalendarIcon } from '@heroicons/react/outline';

const mockRiderData = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    totalDeliveries: 152,
    totalEarnings: 3040.00,
    avgPerDelivery: 20.00,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/40',
    totalDeliveries: 98,
    totalEarnings: 1960.00,
    avgPerDelivery: 20.00,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://via.placeholder.com/40',
    totalDeliveries: 210,
    totalEarnings: 4200.00,
    avgPerDelivery: 20.00,
    status: 'On Break',
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: 'https://via.placeholder.com/40',
    totalDeliveries: 180,
    totalEarnings: 3600.00,
    avgPerDelivery: 20.00,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Chris Lee',
    avatar: 'https://via.placeholder.com/40',
    totalDeliveries: 55,
    totalEarnings: 1100.00,
    avgPerDelivery: 20.00,
    status: 'Inactive',
  },
];

const RiderEarnings = () => {
  const [riders, setRiders] = useState(mockRiderData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalEarnings', direction: 'descending' });

  const sortedRiders = useMemo(() => {
    let sortableItems = [...riders];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [riders, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredRiders = sortedRiders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'On Break':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const SortableHeader = ({ children, name }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort(name)}>
      <div className="flex items-center">
        <span>{children}</span>
        {sortConfig.key === name && (
          sortConfig.direction === 'ascending' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
        )}
      </div>
    </th>
  );

  return (
    <>
      <PageMeta
        title="Rider Earnings | Admin Dashboard"
        description="Track earnings and delivery fees for each rider"
      />
      <PageBreadcrumb pageTitle="Rider Earnings" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by rider name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Date Range"
                    className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <DownloadIcon className="h-5 w-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <SortableHeader name="name">Rider</SortableHeader>
                <SortableHeader name="totalDeliveries">Total Deliveries</SortableHeader>
                <SortableHeader name="totalEarnings">Total Earnings</SortableHeader>
                <SortableHeader name="avgPerDelivery">Avg. Per Delivery</SortableHeader>
                <SortableHeader name="status">Status</SortableHeader>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredRiders.map((rider) => (
                <tr key={rider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={rider.avatar} alt={`${rider.name} avatar`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{rider.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{rider.totalDeliveries}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${rider.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${rider.avgPerDelivery.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(rider.status)}`}>
                      {rider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RiderEarnings;
