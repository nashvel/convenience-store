import React from 'react';
import { FaTrash } from 'react-icons/fa';

const ProductVariants = ({ variants, setVariants }) => {

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', value: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index][name] = value;
    setVariants(newVariants);
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800">Product Variants</h3>
      {variants.map((variant, index) => (
        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <input
            type="text"
            name="name"
            value={variant.name}
            onChange={(e) => handleVariantChange(index, e)}
            placeholder="Attribute Name (e.g., Size)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="value"
            value={variant.value}
            onChange={(e) => handleVariantChange(index, e)}
            placeholder="Value (e.g., Small)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="price"
            value={variant.price}
            onChange={(e) => handleVariantChange(index, e)}
            placeholder="Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="stock"
            value={variant.stock}
            onChange={(e) => handleVariantChange(index, e)}
            placeholder="Stock"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={handleAddVariant} 
        className="w-full mt-2 px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Variant
      </button>
    </div>
  );
};

export default ProductVariants;
