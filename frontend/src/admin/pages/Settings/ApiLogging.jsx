import React, { useState, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, EyeIcon } from '@heroicons/react/solid';

const mockLogs = [
  { id: 1, timestamp: '2023-10-27 14:30:15', method: 'POST', endpoint: '/api/v1/orders', status: 201, ip: '192.168.1.1', responseTime: '120ms', request: { headers: { 'Content-Type': 'application/json' }, body: { product_id: 12, quantity: 2 } }, response: { status: 'Created', order_id: 1052 } },
  { id: 2, timestamp: '2023-10-27 14:31:02', method: 'GET', endpoint: '/api/v1/products', status: 200, ip: '192.168.1.2', responseTime: '50ms', request: {}, response: { count: 50, data: '[...]' } },
  { id: 3, timestamp: '2023-10-27 14:32:45', method: 'GET', endpoint: '/api/v1/products/999', status: 404, ip: '192.168.1.1', responseTime: '35ms', request: {}, response: { error: 'Product not found' } },
  { id: 4, timestamp: '2023-10-27 14:33:10', method: 'PUT', endpoint: '/api/v1/users/profile', status: 200, ip: '192.168.1.3', responseTime: '250ms', request: { headers: { 'Authorization': 'Bearer ...' } }, response: { status: 'Success' } },
  { id: 5, timestamp: '2023-10-27 14:34:00', method: 'DELETE', endpoint: '/api/v1/cart/item/3', status: 204, ip: '192.168.1.2', responseTime: '80ms', request: {}, response: {} },
  { id: 6, timestamp: '2023-10-27 14:35:21', method: 'POST', endpoint: '/api/v1/auth/login', status: 500, ip: '192.168.1.4', responseTime: '500ms', request: {}, response: { error: 'Internal Server Error' } },
];

const LogDetailModal = ({ log, onClose }) => {
  if (!log) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Log Details</h3>
        <div className="space-y-4">
            <div><strong>Timestamp:</strong> <span className="font-mono dark:text-gray-300">{log.timestamp}</span></div>
            <div><strong>Endpoint:</strong> <span className="font-mono dark:text-gray-300">{log.method} {log.endpoint}</span></div>
            <div><strong>Status:</strong> <span className="font-mono dark:text-gray-300">{log.status}</span></div>
            <div><strong>IP Address:</strong> <span className="font-mono dark:text-gray-300">{log.ip}</span></div>
            <div><strong>Response Time:</strong> <span className="font-mono dark:text-gray-300">{log.responseTime}</span></div>
            <div className="mt-4">
                <h4 className="font-semibold dark:text-white">Request</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 text-sm overflow-x-auto">{JSON.stringify(log.request, null, 2)}</pre>
            </div>
            <div className="mt-4">
                <h4 className="font-semibold dark:text-white">Response</h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 text-sm overflow-x-auto">{JSON.stringify(log.response, null, 2)}</pre>
            </div>
        </div>
        <button onClick={onClose} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Close</button>
      </div>
    </div>
  );
};

const ApiLogging = () => {
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => methodFilter === 'All' || log.method === methodFilter)
      .filter(log => statusFilter === 'All' || Math.floor(log.status / 100) === parseInt(statusFilter))
      .filter(log =>
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [logs, searchTerm, methodFilter, statusFilter]);

  const getStatusClass = (status) => {
    if (status >= 500) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status >= 400) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status >= 300) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (status >= 200) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getMethodClass = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      <PageMeta title="API & Logging | Admin Dashboard" description="Manage API logging and view logs" />
      <PageBreadcrumb pageTitle="API & Logging" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">API Logging Settings</h3>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable API Logging</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isLoggingEnabled} onChange={() => setIsLoggingEnabled(!isLoggingEnabled)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="form-select">
              <option value="All">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
                <option value="All">All Statuses</option>
                <option value="2">2xx Success</option>
                <option value="3">3xx Redirection</option>
                <option value="4">4xx Client Error</option>
                <option value="5">5xx Server Error</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Endpoint</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">IP Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Response Time</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodClass(log.method)}`}>{log.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">{log.endpoint}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(log.status)}`}>{log.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{log.responseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedLog(log)} className="text-blue-600 hover:text-blue-900"><EyeIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  );
};

export default ApiLogging;
