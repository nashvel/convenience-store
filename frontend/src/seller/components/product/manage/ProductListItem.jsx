import React, { useState } from 'react';
import { PRODUCT_ASSET_URL } from '../../../../config';
import { FaEdit, FaTrash, FaChevronDown, FaClock, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ProductListItem = ({ product, onSelect, onDelete, isSelected }) => {


  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getAttribute = (variant, attributeName) => {
    if (!variant || !variant.attributes || typeof variant.attributes !== 'object') {
      return '';
    }
    const attributeKey = Object.keys(variant.attributes).find(key => key.toLowerCase() === attributeName.toLowerCase());
    return attributeKey ? variant.attributes[attributeKey] : '';
  };

  const getApprovalStatus = () => {
    // Handle different data types: boolean true, integer 1, string "1"
    const isApproved = product.is_approved === true || product.is_approved === 1 || product.is_approved === '1';
    const isActive = product.is_active === true || product.is_active === 1 || product.is_active === '1' || product.is_active === undefined;
    
    if (isApproved) {
      return {
        status: 'approved',
        label: 'Approved',
        icon: FaCheck,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      };
    } else if (!isApproved && !isActive) {
      return {
        status: 'rejected',
        label: 'Rejected',
        icon: FaTimes,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      };
    } else {
      return {
        status: 'pending',
        label: 'Pending Approval',
        icon: FaClock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      };
    }
  };

  const approvalStatus = getApprovalStatus();
  const StatusIcon = approvalStatus.icon;

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="p-4 grid grid-cols-12 gap-4 items-center cursor-pointer" onClick={handleToggleExpand}>
        {/* Product Image */}
        <div className="col-span-2 flex items-center">
          <img src={product.image ? `${PRODUCT_ASSET_URL}/${product.image}` : 'https://via.placeholder.com/80'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
        </div>

        {/* Product Info */}
        <div className="col-span-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-blue-800">{product.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${approvalStatus.bgColor} ${approvalStatus.textColor}`}>
              <StatusIcon className={`mr-1 ${approvalStatus.iconColor}`} size={10} />
              {approvalStatus.label}
            </span>
          </div>
          {product.product_type === 'variable' ? (
            <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
          ) : (
            <p className="text-sm text-gray-500">₱{product.price} - {product.stock} in stock</p>
          )}
          {product.rejection_reason && approvalStatus.status === 'rejected' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center text-red-700 text-xs font-medium mb-1">
                <FaExclamationTriangle className="mr-1" size={10} />
                Rejection Reason
              </div>
              <p className="text-red-600 text-xs">{product.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="col-span-5 flex items-center justify-end gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onSelect(product); }} 
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              approvalStatus.status === 'approved' 
                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
            }`}
            disabled={approvalStatus.status !== 'approved'}
          >
            Edit
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} 
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <FaTrash />
          </button>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <FaChevronDown className="text-gray-500" />
          </div>
        </div>
      </div>

      {product.product_type === 'variable' && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Variants:</h4>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-600 px-3 py-2 border-b">
                <div>Size</div>
                <div>Color</div>
                <div className="truncate">SKU</div>
                <div>Price</div>
                <div>Stock</div>
                <div>Image</div>
              </div>
              {/* Rows */}
              {product.variants?.map((variant) => (
                <div key={variant.id} className="grid grid-cols-6 gap-2 items-center text-sm bg-white p-2 rounded-lg shadow-sm">
                  <div>{getAttribute(variant, 'Size')}</div>
                  <div>{getAttribute(variant, 'Color')}</div>
                  <div className="truncate">{variant.sku}</div>
                  <div>₱{variant.price}</div>
                  <div>{variant.stock}</div>
                  <div>
                    <img 
                      src={`${PRODUCT_ASSET_URL}/${variant.image || product.image}`}
                      alt={`${product.name} - ${getAttribute(variant, 'Color')}`}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {product.product_type === 'single' && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-md font-semibold mb-2 text-gray-700">Description:</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.description || 'No description available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListItem;
