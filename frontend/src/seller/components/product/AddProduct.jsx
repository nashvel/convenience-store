import React, { useState } from 'react';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'price') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = '';
      }
    }
    setProductData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Product "${productData.name}" added successfully!`);
      setProductData({ name: '', price: '', category: '', image: '' });
    } catch (error) {
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Add a New Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors"
          />
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors"
          />
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors"
          />
          <input
            type="text"
            name="image"
            value={productData.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="w-full px-5 py-3.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
