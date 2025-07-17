import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios-config';
import { toast } from 'react-toastify';
import { SearchIcon, XIcon, ClipboardListIcon, TagIcon } from '@heroicons/react/solid';

import AdminProductCard from '../../components/products/AdminProductCard';
import EditProductModal from './EditProductModal';
import CategorySidebar from '../../components/products/CategorySidebar';
import ProductCardSkeleton from '../../components/products/ProductCardSkeleton';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [categoryPath, setCategoryPath] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pager, setPager] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        perPage: 20,
        category_id: selectedCategory,
        search: debouncedSearchTerm,
      };

      const response = await api.get('/admin/products', { params });

      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setPager(response.data.pager);
      } else {
        setError('Received invalid product data from the server.');
        setProducts([]);
        setPager(null);
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
        const response = await api.get('/admin/categories');
        if (response.data && Array.isArray(response.data)) {
            setAllCategories(response.data);
        } else {
            console.error('Categories API response is not an array:', response.data);
        }
    } catch (error) {
        toast.error('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();

    // Calculate category path for breadcrumbs
    if (selectedCategory) {
      const findPath = (categories, categoryId) => {
        for (const category of categories) {
          if (category.id === categoryId) {
            return [category];
          }
          if (category.subcategories) {
            const path = findPath(category.subcategories, categoryId);
            if (path.length > 0) {
              return [category, ...path];
            }
          }
        }
        return [];
      };
      const path = findPath(allCategories, selectedCategory);
      setCategoryPath(path);
    } else {
      setCategoryPath([]);
    }
  }, [currentPage, selectedCategory, debouncedSearchTerm, allCategories]);

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/admin/products/${productToDelete.id}`);
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
      fetchProducts(); // Refetch products
    } catch (error) {
      toast.error('Failed to delete product.');
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      const isUpdating = productData.get('id');
      const url = isUpdating ? `/admin/products/update/${productData.get('id')}` : '/admin/products/create';
      await api.post(url, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsEditModalOpen(false);
      setProductToEdit(null);
      
      if (!isUpdating) {
        setCurrentPage(1); // Go to first page on create
      }

      fetchProducts(); // Refetch products
      toast.success('Product saved successfully!');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product.');
      // Re-throw error to notify the modal that the save failed
      throw error;
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Products are now filtered by the backend, so we just use the state directly.
  const filteredProducts = products;

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">


        <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-6">
            <Link to="/admin/approval-queue" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ClipboardListIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Approval Queue</span>
            </Link>
            <Link to="/admin/manage-promotions" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <TagIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Manage Promotions</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar 
            categories={allCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          <div className="flex-1">
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-full">
                {categoryPath.length > 0 && (
                  <div className="mb-4 flex items-center flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-500">Filtering by:</span>
                    {categoryPath.map((cat, index) => (
                      <span
                        key={cat.id}
                        className="flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                      >
                        <span onClick={() => handleSelectCategory(cat.id)}>{cat.name}</span>
                        <XIcon 
                          className="h-4 w-4 ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => handleSelectCategory(index > 0 ? categoryPath[index - 1].id : null)}
                        />
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <AdminProductCard
                        key={product.id}
                        product={product}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                        size="small"
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                      No products found matching your criteria.
                    </div>
                  )}
                </div>
              )}
            </div>

            {pager && pager.pageCount > 1 && (
              <nav className="flex justify-between items-center pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{pager.currentPage}</span> of <span className="font-semibold text-gray-900">{pager.pageCount}</span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={pager.currentPage === 1}
                      className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: pager.pageCount }, (_, i) => i + 1).map(pageNumber => (
                    <li key={pageNumber}>
                      <button
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 leading-tight border ${ pager.currentPage === pageNumber ? 'text-blue-600 bg-blue-50 border-blue-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'}`}>
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pager.pageCount))}
                      disabled={pager.currentPage === pager.pageCount}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
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
    </>
  );
};

export default ProductList;
