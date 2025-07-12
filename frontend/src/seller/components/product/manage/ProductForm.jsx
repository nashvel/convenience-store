import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const ProductForm = ({ currentProduct, onSave, onCancel }) => {
  const [formData, setFormData] = useState(currentProduct);
  const isNewProduct = !currentProduct.id;

  useEffect(() => {
    setFormData(currentProduct);
  }, [currentProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const variants = [...formData.variants];
    variants[index][name] = value;
    setFormData(prev => ({ ...prev, variants }));
  };

  const addVariant = () => {
    const newVariant = { id: `new_${Date.now()}`, size: '', color: '', price: '', stock: '', sku: '', imageUrl: '' };
    setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
  };

  const removeVariant = (index) => {
    const variants = [...formData.variants];
    variants.splice(index, 1);
    setFormData(prev => ({ ...prev, variants }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h2>
      
      {/* General Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full input-field" placeholder="e.g., Vintage Leather Jacket" required />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full input-field" placeholder="https://example.com/image.jpg" required />
        </div>
        <div>
          <label htmlFor="product_type" className="block text-sm font-medium text-gray-600 mb-1">Product Type</label>
          <select name="product_type" value={formData.product_type} onChange={handleInputChange} className="w-full input-field">
            <option value="single">Single</option>
            <option value="variable">Variable</option>
          </select>
        </div>
      </div>

      {/* Conditional Fields based on Product Type */}
      {formData.product_type === 'single' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full input-field" placeholder="e.g., 120.00" required step="0.01" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full input-field" placeholder="e.g., 15" required />
          </div>
        </div>
      ) : (
        <div>
          <h3 class="text-lg font-bold text-gray-700 mb-4">Product Variants</h3>
          {(formData.variants || []).map((variant, index) => (
            <div key={variant.id} className="p-4 rounded-lg bg-gray-50 border mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size (e.g., Medium)" className="input-field" />
                <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} placeholder="Color (e.g., Red)" className="input-field" />
                <input type="text" name="sku" value={variant.sku} onChange={(e) => handleVariantChange(index, e)} placeholder="SKU" className="input-field" />
                <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="input-field" step="0.01" />
                <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} placeholder="Stock" className="input-field" />
                <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 justify-self-start md:justify-self-end">
                  <FaTrash />
                </button>
              </div>
              <div className="mt-4">
                 <input type="text" name="imageUrl" value={variant.imageUrl} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant Image URL (optional)" className="input-field w-full" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors font-semibold">
            <FaPlus /> Add Variant
          </button>
        </div>
      )}

      {/* Form Actions */}
      <div className="mt-8 flex justify-end items-center gap-4">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold">
          <FaTimes /> Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors font-semibold">
          <FaSave /> {isNewProduct ? 'Save Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
