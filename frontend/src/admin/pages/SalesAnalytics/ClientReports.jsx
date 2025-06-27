import React, { useState, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, CalendarIcon } from '@heroicons/react/outline';

const mockClientData = [
  {
    id: 1,
    name: 'GadgetStore',
    logo: 'https://via.placeholder.com/40',
    totalSales: 125430.50,
    orders: 1230,
    avgOrderValue: 101.98,
    conversionRate: 5.2,
  },
  {
    id: 2,
    name: 'Super Kicks',
    logo: 'https://via.placeholder.com/40',
    totalSales: 89750.00,
    orders: 980,
    avgOrderValue: 91.58,
    conversionRate: 4.8,
  },
  {
    id: 3,
    name: 'Book Haven',
    logo: 'https://via.placeholder.com/40',
    totalSales: 45200.75,
    orders: 1850,
    avgOrderValue: 24.43,
    conversionRate: 6.1,
  },
  {
    id: 4,
    name: 'Home Essentials',
    logo: 'https://via.placeholder.com/40',
    totalSales: 67890.25,
    orders: 750,
    avgOrderValue: 90.52,
    conversionRate: 4.5,
  },
];

const ClientReports = () => {
  const [clients, setClients] = useState(mockClientData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalSales', direction: 'descending' });

  const sortedClients = useMemo(() => {
    let sortableItems = [...clients];
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
  }, [clients, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredClients = sortedClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="Client Reports | Admin Dashboard"
        description="View detailed sales reports for each client"
      />
      <PageBreadcrumb pageTitle="Client Reports" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name..."
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
                    // This would be replaced with a real date range picker component
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
                <SortableHeader name="name">Client</SortableHeader>
                <SortableHeader name="totalSales">Total Sales</SortableHeader>
                <SortableHeader name="orders">Orders</SortableHeader>
                <SortableHeader name="avgOrderValue">Avg. Order Value</SortableHeader>
                <SortableHeader name="conversionRate">Conversion Rate</SortableHeader>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={client.logo} alt={`${client.name} logo`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${client.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.orders.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${client.avgOrderValue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.conversionRate.toFixed(1)}%</td>
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

export default ClientReports;
