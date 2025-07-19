import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaClock, FaStore, FaTag, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../api/axios-config';
import ConfirmationModal from '../common/ConfirmationModal';

const ProductApprovalManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'pending' ? '/admin/products/pending' : '/admin/products/rejected';
      const response = await api.get(`${endpoint}?page=${page}&perPage=10`);
      
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (product) => {
    setSelectedProduct(product);
    setActionType('approve');
    setShowConfirmModal(true);
  };

  const handleReject = async (product) => {
    setSelectedProduct(product);
    setActionType('reject');
    setShowRejectModal(true);
  };

  const confirmAction = async () => {
    if (!selectedProduct) return;

    try {
      if (actionType === 'approve') {
        await api.post(`/admin/products/${selectedProduct.id}/approve`);
        toast.success('Product approved successfully!');
      } else if (actionType === 'reject') {
        await api.post(`/admin/products/${selectedProduct.id}/reject`, {
          reason: rejectionReason || 'No reason provided'
        });
        toast.success('Product rejected successfully!');
      }
      
      fetchProducts();
      setShowConfirmModal(false);
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error processing action:', error);
      toast.error(`Failed to ${actionType} product`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {product.image ? (
              <div className="relative w-16 h-16">
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/uploads/products/${product.image}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                  }}
                />
                <div className="fallback-icon w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 absolute top-0 left-0" style={{display: 'none'}}>
                  <FaImage className="text-gray-400 text-xl" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <FaImage className="text-gray-400 text-xl" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FaStore className="mr-1" />
                  {product.store_name}
                </span>
                <span className="flex items-center">
                  <FaTag className="mr-1" />
                  {product.category_name}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 mb-1">
              ₱{parseFloat(product.price || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              Stock: {product.stock || 'N/A'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {activeTab === 'pending' ? 'Submitted' : 'Updated'}: {formatDate(product.created_at || product.updated_at)}
            </div>
          </div>
        </div>

        {product.rejection_reason && activeTab === 'rejected' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700 text-sm font-medium mb-1">
              <FaExclamationTriangle className="mr-2" />
              Rejection Reason
            </div>
            <p className="text-red-600 text-sm">{product.rejection_reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeTab === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {activeTab === 'pending' ? (
                <>
                  <FaClock className="inline mr-1" />
                  Pending Approval
                </>
              ) : (
                <>
                  <FaTimes className="inline mr-1" />
                  Rejected
                </>
              )}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              product.product_type === 'single' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {product.product_type === 'single' ? 'Single Product' : 'Variable Product'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeTab === 'pending' && (
              <>
                <button
                  onClick={() => handleReject(product)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(product)}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
                >
                  <FaCheck className="mr-1" />
                  Approve
                </button>
              </>
            )}
            {activeTab === 'rejected' && (
              <button
                onClick={() => handleApprove(product)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
              >
                <FaCheck className="mr-1" />
                Re-approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Pagination = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
          {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchProducts(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => fetchProducts(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_pages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Approval Management</h1>
        <p className="text-gray-600">Review and manage product submissions from sellers</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaClock className="inline mr-2" />
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaTimes className="inline mr-2" />
              Rejected Products
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {activeTab === 'pending' ? <FaClock /> : <FaTimes />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} products found
          </h3>
          <p className="text-gray-500">
            {activeTab === 'pending' 
              ? 'All products have been reviewed.' 
              : 'No products have been rejected.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <Pagination />
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmAction}
          title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Product`}
          message={`Are you sure you want to ${actionType} "${selectedProduct?.name}"?`}
          confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
          confirmButtonClass={actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
        />
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Product: {selectedProduct?.name}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Reject Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApprovalManagement;
