import React, { useState } from 'react';
import ProductVariants from './manage/ProductVariants';
import { FaTimes } from 'react-icons/fa';

const AddProduct = ({ onSave, onCancel, loading }) => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    description: '',
    product_type: 'single',
    variants: [],
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files[0]) {
      const file = files[0];
      setProductData((prev) => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    let parsedValue = value;
    if (name === 'price' || name === 'stock') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = '';
      }
    }
    setProductData((prev) => ({ ...prev, [name]: parsedValue }));
    if (name === 'product_type' && value === 'variable') {
      setProductData(prev => ({ ...prev, variants: [] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productData);
  };

  if (!loading && !onSave) return null; // A simple way to check if it should be rendered

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">
          <FaTimes />
        </button>
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">Add a New Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="product_type"
                  value="single"
                  checked={productData.product_type === 'single'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Single</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="product_type"
                  value="variable"
                  checked={productData.product_type === 'variable'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Variable</span>
              </label>
            </div>
          </div>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          {productData.product_type === 'single' && (
            <>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </>
          )}
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Product Description"
            rows="4"
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Product Preview" className="mx-auto h-48 w-auto object-cover rounded-md" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          {productData.product_type === 'variable' && (
            <ProductVariants 
              variants={productData.variants}
              setVariants={(newVariants) => setProductData(prev => ({ ...prev, variants: newVariants }))}
            />
          )}
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
