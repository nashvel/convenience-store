import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { CheckIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from '../../../api/axios-config';
import AdminPanelSpinner from "../../components/common/AdminPanelSpinner";

const allMockProducts = [
  // Pending
  { id: 1, name: 'Vintage Style T-Shirt', seller_name: 'Retro Threads', created_at: '2023-10-28T10:00:00Z', status: 'pending', imageUrl: '/images/stock/t-shirt-vintage.jpg', variants: [{ id: 11, size: 'M', color: 'Heather Gray', price: '25.00', stock: 50, sku: 'RT-VTG-M-GRY' }, { id: 12, size: 'L', color: 'Heather Gray', price: '25.00', stock: 30, sku: 'RT-VTG-L-GRY' }] },
  { id: 2, name: 'Modern Wireless Keyboard', seller_name: 'Techie Stuff Inc.', created_at: '2023-10-27T14:30:00Z', status: 'pending', imageUrl: '/images/stock/keyboard-wireless.jpg', variants: [{ id: 21, size: 'N/A', color: 'Arctic White', price: '99.99', stock: 25, sku: 'TS-WK-WHT' }] },
  // Approved
  { id: 3, name: 'Handcrafted Leather Boots', seller_name: 'Artisan Footwear', created_at: '2023-10-26T09:15:00Z', status: 'approved', imageUrl: '/images/stock/leather-boots.jpg', variants: [{ id: 31, size: '10', color: 'Cognac', price: '195.50', stock: 12, sku: 'AF-LB-10-COG' }] },
  { id: 4, name: 'Organic Green Tea', seller_name: 'PureLeaf Organics', created_at: '2023-10-25T18:00:00Z', status: 'approved', imageUrl: '/images/stock/green-tea.jpg', variants: [{ id: 41, size: '100g', color: 'N/A', price: '15.00', stock: 100, sku: 'PLO-GT-100G' }] },
  // Rejected
  { id: 5, name: 'Mystery Box (Gambling)', seller_name: 'Risky Biz', created_at: '2023-10-24T11:45:00Z', status: 'rejected', rejection_reason: 'Violates policy on gambling products.', imageUrl: '/images/stock/mystery-box.jpg', variants: [{ id: 51, size: 'Small', color: 'N/A', price: '50.00', stock: 5, sku: 'RB-MB-SML' }] },
];

const StatusFilter = ({ currentFilter, setFilter, counts }) => {
  const filters = ['pending', 'approved', 'rejected'];
  return (
    <div className="flex items-center border-b border-blue-200 dark:border-blue-800 mb-6">
      {filters.map(filter => {
        const isActive = currentFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setFilter(filter)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-b-2 border-transparent text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}>
            {filter} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' : 'bg-blue-100/50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300'}`}>{counts[filter] || 0}</span>
          </button>
        );
      })}
    </div>
  );
};

const ApprovalQueue = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you might fetch based on filter:
        // const response = await api.get(`/admin/products?status=${filter}`);
        // For this prototype, we fetch all and filter client-side.
        setAllProducts(allMockProducts);
      } catch (error) {
        toast.error('Failed to fetch products.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => p.status === filter);
  }, [allProducts, filter]);

  const statusCounts = useMemo(() => {
    return allProducts.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {});
  }, [allProducts]);

  const toggleRow = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleApproval = async (productId, newStatus, reason = '') => {
    // Optimistically update UI for prototype
    const productToEnd = allProducts.find(p => p.id === productId);
    if (productToEnd) {
      productToEnd.status = newStatus;
      if (newStatus === 'rejected') {
        productToEnd.rejection_reason = reason || 'No reason provided.';
      }
      setAllProducts([...allProducts]);
      toast.success(`Product has been ${newStatus}.`);
    }

    // try {
    //   await api.put(`/admin/products/${productId}/status`, { status: newStatus, reason });
    //   // Refetch or update state
    // } catch (error) {
    //   toast.error(`Failed to update product status.`);
    // }
  };

  if (loading) {
    return <AdminPanelSpinner />; 
  }

  return (
    <>
      <PageMeta title="Product Management | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Product Management" />
      <div className="p-4 sm:p-6 bg-blue-50/50 dark:bg-gray-900 rounded-lg shadow-md">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-900 dark:text-white">Products</h2>
        </header>

        <StatusFilter currentFilter={filter} setFilter={setFilter} counts={statusCounts} />

        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-900">
              <thead className="bg-blue-100 dark:bg-blue-900/30">
                <tr>
                  <th scope="col" className="w-12 px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Seller</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Submitted</th>
                  {filter === 'rejected' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Rejection Reason</th>}
                  {filter === 'pending' && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200 dark:bg-gray-800 dark:divide-blue-900">
                {filteredProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <tr className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-blue-50/70 dark:bg-gray-800/50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => toggleRow(product.id)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300" aria-label="Expand row">
                          {expandedRows.includes(product.id) ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img className="h-12 w-12 rounded-md object-cover" src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-900 dark:text-white">{product.name}</div>
                            <div className="text-sm text-blue-500 dark:text-blue-400">{product.variants?.length || 1} variant(s)</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{product.seller_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{new Date(product.created_at).toLocaleDateString()}</td>
                      {filter === 'rejected' && <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 dark:text-red-400">{product.rejection_reason}</td>}
                      {filter === 'pending' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-3">
                            <button onClick={() => handleApproval(product.id, 'rejected', window.prompt('Reason for rejection:'))} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800" aria-label="Reject">
                              <XIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleApproval(product.id, 'approved')} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800" aria-label="Approve">
                              <CheckIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandedRows.includes(product.id) && (
                      <tr className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-blue-50/70 dark:bg-gray-800/50'}>
                        <td colSpan={filter === 'pending' ? 6 : 5} className="p-0">
                          <div className="p-4 bg-blue-100/30 dark:bg-gray-700/50">
                            <h4 className="font-semibold text-md text-blue-900 dark:text-white mb-3">Variants</h4>
                            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800 rounded-lg overflow-hidden">
                              <thead className="bg-blue-200 dark:bg-blue-900/50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase">Size</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase">Color</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase">Price</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase">Stock</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase">SKU</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-200 dark:divide-blue-800">
                                {product.variants.map((variant, v_index) => (
                                  <tr key={variant.id} className={v_index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-blue-50/70 dark:bg-gray-700/50'}>
                                    <td className="px-4 py-3 text-sm text-blue-800 dark:text-blue-300">{variant.size}</td>
                                    <td className="px-4 py-3 text-sm text-blue-800 dark:text-blue-300">{variant.color}</td>
                                    <td className="px-4 py-3 text-sm text-blue-800 dark:text-blue-300">${parseFloat(variant.price).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-blue-800 dark:text-blue-300">{variant.stock}</td>
                                    <td className="px-4 py-3 text-sm text-blue-800 dark:text-blue-300">{variant.sku}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-white">No products found for '{filter}' status.</h3>
            <p className="mt-2 text-blue-600 dark:text-blue-400">Try selecting a different status or check back later.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ApprovalQueue;
