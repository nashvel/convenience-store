import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';

const ProductListItem = ({ product, onSelect, onDelete, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    if (product.product_type === 'variable') {
      setIsExpanded(!isExpanded);
    }
  };

  const displayInfo = product.product_type === 'single'
    ? `$${parseFloat(product.price).toFixed(2)} · ${product.stock} in stock`
    : `${(product.variants || []).length} variant(s)`;

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="p-4 grid grid-cols-12 gap-4 items-center cursor-pointer" onClick={product.product_type === 'variable' ? handleToggleExpand : () => onSelect(product)}>
        {/* Product Image */}
        <div className="col-span-2 flex items-center">
          <img src={product.imageUrl || 'https://via.placeholder.com/80'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
        </div>

        {/* Product Info */}
        <div className="col-span-6">
          <h3 className="font-bold text-lg text-blue-800">{product.name}</h3>
          {product.product_type === 'variable' ? (
            <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
          ) : (
            <p className="text-sm text-gray-500">${product.price} - {product.stock} in stock</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="col-span-4 flex items-center justify-end gap-3">
          <button onClick={(e) => { e.stopPropagation(); onSelect(product); }} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Edit</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="p-2 text-gray-500 hover:text-red-600 transition-colors"><FaTrash /></button>
          {product.product_type === 'variable' ? (
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <FaChevronDown className="text-gray-500" />
            </div>
          ) : (
            <div className="w-5"></div> // Placeholder for alignment
          )}
        </div>
      </div>

      {product.product_type === 'variable' && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="font-semibold text-md mb-2 text-gray-700">Variants:</h4>
            <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-600 mb-2 px-2">
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Color</div>
              <div className="col-span-1">SKU</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Image</div>
            </div>
            <ul className="space-y-2">
              {product.variants?.map((variant, index) => (
                <li key={index} className="grid grid-cols-6 gap-2 items-center text-sm bg-white p-2 rounded-md shadow-sm">
                  <div className="col-span-1">{variant.size}</div>
                  <div className="col-span-1">{variant.color}</div>
                  <div className="col-span-1 truncate">{variant.sku}</div>
                  <div className="col-span-1">${variant.price}</div>
                  <div className="col-span-1">{variant.stock}</div>
                  <div className="col-span-1">
                    <img src={variant.variantImage || 'https://via.placeholder.com/40'} alt={`${product.name} ${variant.color} ${variant.size}`} className="w-10 h-10 object-cover rounded-md" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListItem;
