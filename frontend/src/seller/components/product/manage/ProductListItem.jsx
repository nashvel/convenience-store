import React, { useState } from 'react';
import { PRODUCT_ASSET_URL } from '../../../../config';
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';

const ProductListItem = ({ product, onSelect, onDelete, isSelected }) => {


  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    if (product.product_type === 'variable') {
      setIsExpanded(!isExpanded);
    }
  };

  const getAttribute = (variant, attributeName) => {
    if (!variant || !variant.attributes || typeof variant.attributes !== 'object') {
      return '';
    }
    const attributeKey = Object.keys(variant.attributes).find(key => key.toLowerCase() === attributeName.toLowerCase());
    return attributeKey ? variant.attributes[attributeKey] : '';
  };

  const displayInfo = product.product_type === 'single'
    ? `$${parseFloat(product.price).toFixed(2)} · ${product.stock} in stock`
    : `${(product.variants || []).length} variant(s)`;

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="p-4 grid grid-cols-12 gap-4 items-center cursor-pointer" onClick={product.product_type === 'variable' ? handleToggleExpand : () => onSelect(product)}>
        {/* Product Image */}
        <div className="col-span-2 flex items-center">
          <img src={product.image ? `${PRODUCT_ASSET_URL}/${product.image}` : 'https://via.placeholder.com/80'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
        </div>

        {/* Product Info */}
        <div className="col-span-6">
          <h3 className="font-bold text-lg text-blue-800">{product.name}</h3>
          {product.product_type === 'variable' ? (
            <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
          ) : (
            <p className="text-sm text-gray-500">₱{product.price} - {product.stock} in stock</p>
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
    </div>
  );
};

export default ProductListItem;
