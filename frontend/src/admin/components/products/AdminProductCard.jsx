import React from 'react';
import ProductCard from '../../../components/Cards/ProductCard';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

const AdminProductCard = ({ product, onEditClick, onDeleteClick, size }) => {
  return (
    <div className="relative group">
      <ProductCard product={product} size={size} />
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
