import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddProduct from './AddProduct';
import ProductForm from './manage/ProductForm';
import ProductListItem from './manage/ProductListItem';
import api from '../../../api/axios-config';
import ManageProductsSkeleton from '../../skeleton/ManageProductsSkeleton';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

    const emptyProduct = { id: null, name: '', product_type: 'single', price: '', stock: '', imageUrl: '', variants: [] };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await api.get('/seller/products/my-products');
            setProducts(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(emptyProduct);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setSelectedProduct(null);
    setIsFormVisible(false);
  };

    const handleSaveForm = async (productToSave) => {
    setIsSaving(true);
    try {
        if (productToSave.id) {
            // Update existing product
            await api.put(`/seller/products/my-products/${productToSave.id}`, productToSave);
            setProducts(products.map(p => (p.id === productToSave.id ? productToSave : p)));
            toast.success('Product updated successfully!');
        } else {
            // Add new product
            const response = await api.post('/seller/products/my-products', productToSave);
            const newProduct = response.data;
            setProducts([newProduct, ...products]);
            toast.success('Product added successfully!');
        }
        setIsFormVisible(false);
        setSelectedProduct(null);
    } catch (err) {
        toast.error('Failed to save product. Please try again.');
        console.error(err);
    } finally {
        setIsSaving(false);
    }
  };

    const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
    }
    try {
        await api.delete(`/seller/products/my-products/${id}`);
        setProducts(products.filter(p => p.id !== id));
        if (selectedProduct && selectedProduct.id === id) {
            handleCancelForm();
        }
        toast.success('Product deleted successfully!');
    } catch (err) {
        toast.error('Failed to delete product.');
        console.error(err);
    }
  };

    if (loading) {
    return <ManageProductsSkeleton />;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error fetching products: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-800">Manage Products</h1>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-semibold">
          <FaPlus /> Add New Product
        </button>
      </header>

      <div className="mt-6">
        {isFormVisible && selectedProduct && selectedProduct.id !== null && (
          <div className="mb-6">
            <ProductForm 
              currentProduct={selectedProduct} 
              onSave={handleSaveForm} 
              onCancel={handleCancelForm} 
            />
          </div>
        )}

        {isFormVisible && selectedProduct && selectedProduct.id === null && (
            <AddProduct 
                onSave={handleSaveForm}
                onCancel={handleCancelForm}
                loading={isSaving}
            />
        )}

        <div className="space-y-4">
          {products.map(product => (
            <ProductListItem 
              key={product.id} 
              product={product}
              onSelect={handleSelectProduct}
              onDelete={handleDelete}
              isSelected={selectedProduct && selectedProduct.id === product.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
