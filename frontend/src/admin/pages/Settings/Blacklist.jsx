import React, { useState, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, TrashIcon, UserIcon, GlobeAltIcon, PlusIcon } from '@heroicons/react/solid';

const mockBlacklist = [
  { id: 1, type: 'User', identifier: 'john.doe@example.com', reason: 'Spamming reviews', dateAdded: '2023-10-20', addedBy: 'Admin' },
  { id: 2, type: 'IP', identifier: '203.0.113.55', reason: 'Attempted SQL injection', dateAdded: '2023-10-19', addedBy: 'System' },
  { id: 3, type: 'User', identifier: 'scam_user_123', reason: 'Fraudulent chargebacks', dateAdded: '2023-10-18', addedBy: 'Admin' },
  { id: 4, type: 'IP', identifier: '198.51.100.10', reason: 'Brute-force login attempts', dateAdded: '2023-10-17', addedBy: 'System' },
];

const Blacklist = () => {
  const [blacklist, setBlacklist] = useState(mockBlacklist);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [newEntry, setNewEntry] = useState({ type: 'User', identifier: '', reason: '' });

  const filteredBlacklist = useMemo(() => {
    return blacklist
      .filter(item => filter === 'All' || item.type === filter)
      .filter(item => item.identifier.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [blacklist, searchTerm, filter]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newEntry.identifier || !newEntry.reason) return;
    const newId = blacklist.length > 0 ? Math.max(...blacklist.map(item => item.id)) + 1 : 1;
    setBlacklist([...blacklist, { ...newEntry, id: newId, dateAdded: new Date().toISOString().slice(0, 10), addedBy: 'Admin' }]);
    setNewEntry({ type: 'User', identifier: '', reason: '' });
  };

  const handleRemoveEntry = (id) => {
    setBlacklist(blacklist.filter(item => item.id !== id));
  };

  return (
    <>
      <PageMeta title="Blacklist | Admin Dashboard" description="Manage blacklisted users and IPs" />
      <PageBreadcrumb pageTitle="Blacklist" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Add to Blacklist</h3>
        <form onSubmit={handleAddEntry} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-grow w-full">
            <label htmlFor="type" className="form-label">Type</label>
            <select id="type" value={newEntry.type} onChange={e => setNewEntry({...newEntry, type: e.target.value})} className="form-select w-full">
              <option>User</option>
              <option>IP</option>
            </select>
          </div>
          <div className="flex-grow w-full">
            <label htmlFor="identifier" className="form-label">Identifier (Username, Email, or IP)</label>
            <input type="text" id="identifier" value={newEntry.identifier} onChange={e => setNewEntry({...newEntry, identifier: e.target.value})} className="form-input w-full" placeholder={newEntry.type === 'User' ? 'e.g., user@example.com' : 'e.g., 192.168.1.1'} />
          </div>
          <div className="flex-grow w-full">
            <label htmlFor="reason" className="form-label">Reason</label>
            <input type="text" id="reason" value={newEntry.reason} onChange={e => setNewEntry({...newEntry, reason: e.target.value})} className="form-input w-full" placeholder="e.g., Spamming" />
          </div>
          <button type="submit" className="btn btn-primary h-10"><PlusIcon className="h-5 w-5 mr-2" /> Add</button>
        </form>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button onClick={() => setFilter('All')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'All' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>All</button>
            <button onClick={() => setFilter('User')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'User' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Users</button>
            <button onClick={() => setFilter('IP')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'IP' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>IPs</button>
          </div>
          <div className="relative w-full md:w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blacklist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Identifier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date Added</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Added By</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredBlacklist.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${item.type === 'User' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {item.type === 'User' ? <UserIcon className="h-5 w-5" /> : <GlobeAltIcon className="h-5 w-5" />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.identifier}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.dateAdded}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.addedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleRemoveEntry(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
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

export default Blacklist;
