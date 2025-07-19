import React from 'react';
import ProductCard from '../../../components/Cards/ProductCard';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const AdminProductCard = ({ product, onEditClick, onDeleteClick, size }) => {
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
        label: 'Pending',
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
    <div className="relative group">
      <ProductCard product={product} size={size} />
      
      {/* Approval Status Badge */}
      <div className="absolute top-2 right-2 z-20">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${approvalStatus.bgColor} ${approvalStatus.textColor}`}>
          <StatusIcon className={`mr-1 ${approvalStatus.iconColor}`} size={10} />
          {approvalStatus.label}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
        <button
          onClick={() => onEditClick(product)}
          className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
          aria-label="Edit Product"
        >
          <PencilIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onDeleteClick(product)}
          className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
          aria-label="Delete Product"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
