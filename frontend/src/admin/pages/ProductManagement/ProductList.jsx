import React, { useState, useEffect, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, PlusIcon, PencilIcon, TrashIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import EditProductModal from './EditProductModal';
import ProductListSkeleton from './ProductListSkeleton';
import axios from '../../../api/axios-config';
import { toast } from 'react-toastify';
import { PRODUCT_ASSET_URL } from '../../../config';

const getStockStatus = (stock) => {
  if (stock > 10) return { text: 'In Stock', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
  if (stock > 0) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
  return { text: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pager, setPager] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const productsPromise = axios.get('/api/admin/products', {
          params: { page: currentPage, perPage: 20 }
        });
        const categoriesPromise = axios.get('/api/admin/categories');

        const [productsResponse, categoriesResponse] = await Promise.all([productsPromise, categoriesPromise]);

        if (productsResponse.data && Array.isArray(productsResponse.data.products)) {
          setProducts(productsResponse.data.products);
          setPager(productsResponse.data.pager);
        } else {
          console.error('Products API response is not in the expected format:', productsResponse.data);
          setError('Received invalid product data from the server.');
          setProducts([]);
          setPager(null);
        }

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setAllCategories(categoriesResponse.data);
        } else {
          console.error('Categories API response is not an array:', categoriesResponse.data);
        }

      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        toast.error('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`/api/admin/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
    } catch (error) {
      toast.error('Failed to delete product.');
      console.error('Delete error:', error);
    }

    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await axios.post(`/api/admin/products/update/${updatedProduct.id}`, updatedProduct);

      const category = allCategories.find(c => c.id == updatedProduct.category_id);

      const updatedProductForState = {
        ...products.find(p => p.id === updatedProduct.id),
        ...updatedProduct,
        category_name: category ? category.name : 'N/A',
      };

      const newProducts = products.map(p => 
        p.id === updatedProduct.id ? updatedProductForState : p
      );
      
      setProducts(newProducts);
      toast.success(`Product "${updatedProduct.name}" updated successfully.`);
      setIsEditModalOpen(false);
      setProductToEdit(null);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.messages) {
        const errorMessages = Object.values(error.response.data.messages).join('\n');
        toast.error(errorMessages);
      } else {
        toast.error('Failed to update product.');
      }
      console.error('Update error:', error);
    }
  };

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['All'];
    return ['All', ...new Set(products.map(p => p.category_name))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(product => 
        filterCategory === 'All' || product.category_name === filterCategory
      );
  }, [products, searchTerm, filterCategory]);

  return (
    <>
      <PageMeta
        title="Product List | Admin Dashboard"
        description="View and manage all products"
      />
      <PageBreadcrumb pageTitle="Product List" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              id="category"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={filterCategory}
              onChange={handleFilterChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <ProductListSkeleton />
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Store</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Featured</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    const imageUrl = product.image ? `${PRODUCT_ASSET_URL}/${product.image}` : 'https://via.placeholder.com/80';
                    return (
                      <tr key={product.id} className="dark:bg-gray-800 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover" src={imageUrl} alt={product.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.store_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{parseFloat(product.price).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.featured ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {product.featured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative inline-block text-left">
                            <button onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                              <DotsVerticalIcon className="h-5 w-5" />
                            </button>
                            {activeDropdown === product.id && (
                              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                  <button 
                                    onClick={() => {
                                      setProductToEdit(product);
                                      setIsEditModalOpen(true);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <PencilIcon className="h-5 w-5 mr-3" />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setProductToDelete(product);
                                      setIsDeleteModalOpen(true);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <TrashIcon className="h-5 w-5 mr-3" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {pager && pager.pageCount > 1 && (
          <nav className="flex justify-between items-center pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{pager.currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{pager.pageCount}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={pager.currentPage === 1}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: pager.pageCount }, (_, i) => i + 1).map(pageNumber => (
                <li key={pageNumber}>
                  <button
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 leading-tight border ${ pager.currentPage === pageNumber ? 'text-blue-600 bg-blue-50 border-blue-300 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                    {pageNumber}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pager.pageCount))}
                  disabled={pager.currentPage === pager.pageCount}
                  className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={productToEdit}
        onSave={handleSaveProduct}
        categories={allCategories}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
