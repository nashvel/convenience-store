import React, { useState, useRef } from 'react';
import { PencilIcon, TrashIcon, UploadIcon } from '@heroicons/react/solid';

const VariantItem = ({ variant, onUpdate, onDelete, onImageChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const PRODUCT_ASSET_URL = process.env.REACT_APP_PRODUCT_ASSET_URL || 'http://localhost:8080/uploads/products';

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    onUpdate(variant.id, { ...variant, price: newPrice });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(variant.id, file);
    }
  };

  return (
    <div 
      className="relative group text-center w-28 flex-shrink-0" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {variant.newImagePreview ? (
          <img
            src={variant.newImagePreview}
            alt="New preview"
            className="h-28 w-28 object-cover rounded-lg shadow-md mb-2"
          />
        ) : variant.image_url ? (
          <img
            src={`${PRODUCT_ASSET_URL}/${variant.image_url}`}
            alt={variant.attributes?.map(a => a.attribute_value).join(' / ') || 'Variant'}
            className="h-28 w-28 object-cover rounded-lg shadow-md mb-2"
          />
        ) : (
          <div className="h-28 w-28 bg-gray-200 rounded-lg shadow-md mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering other click events
            console.log(`Promo for variant ${variant.id}`)
          }}
          className="absolute top-1 right-1 z-10 px-1.5 py-0.5 bg-blue-100 text-blue-700 font-medium text-xs rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out opacity-85 hover:opacity-100"
        >
          Use Promo
        </button>

        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center gap-3 transition-opacity">
            <button type="button" onClick={handleImageClick} className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-100">
              <UploadIcon className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => onDelete(variant.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100">
              <TrashIcon className="h-5 w-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
            />
          </div>
        )}
      </div>

      <div className="text-xs font-medium text-gray-600 px-1 mt-2">
        {variant.attributes?.map(attr => (
          <div key={attr.attribute_name} className="truncate">{`${attr.attribute_name}: ${attr.attribute_value}`}</div>
        ))}
      </div>
      <div className="relative mt-1">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
        <input 
          type="number" 
          value={variant.price}
          onChange={handlePriceChange}
          className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded-md text-center text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default VariantItem;
