import React, { useState, useEffect } from 'react';
import ProductVariants from './manage/ProductVariants';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AddProduct = ({ onSave, onCancel, loading, storeType }) => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    image: null,
    description: '',
    product_type: 'single',
    variants: [],
    addons: [],
  });
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories/nested');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Render category options recursively
  const renderCategoryOptions = (categories, level = 0) => {
    const options = [];
    
    categories.forEach(category => {
      const indent = '  '.repeat(level);
      const prefix = level > 0 ? '└─ ' : '';
      
      options.push(
        <option key={category.id} value={category.id}>
          {indent}{prefix}{category.name}
        </option>
      );
      
      if (category.children && category.children.length > 0) {
        options.push(...renderCategoryOptions(category.children, level + 1));
      }
    });
    
    return options;
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 relative">
          <button 
            onClick={onCancel} 
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl transition-colors"
          >
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
          <p className="text-blue-100 mt-1">Create and configure your product details</p>
        </div>
        
        {/* Content */}
        <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Type Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-4">Product Type</label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="product_type"
                    value="single"
                    checked={productData.product_type === 'single'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    productData.product_type === 'single' 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {productData.product_type === 'single' && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Single Product</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="product_type"
                    value="variable"
                    checked={productData.product_type === 'variable'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    productData.product_type === 'variable' 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {productData.product_type === 'variable' && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Variable Product</span>
              </label>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white resize-none"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              {loadingCategories ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <select
                  name="category_id"
                  value={productData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {renderCategoryOptions(categories)}
                </select>
              )}
            </div>
          </div>
          {/* Pricing Section - Only for Single Products */}
          {productData.product_type === 'single' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Product Image Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h3>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-white">
              {imagePreview ? (
                <div className="space-y-4">
                  <img src={imagePreview} alt="Product Preview" className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md" />
                  <p className="text-sm text-gray-600">Image uploaded successfully!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        Choose Image
                      </span>
                      <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
          {productData.product_type === 'variable' && (
            <ProductVariants 
              variants={productData.variants}
              setVariants={(newVariants) => setProductData(prev => ({ ...prev, variants: newVariants }))}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2">
              <FaTimes className="text-sm" />
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
