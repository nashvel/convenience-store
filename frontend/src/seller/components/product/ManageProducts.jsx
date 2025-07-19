import React, { useState, useEffect } from 'react';
import JoyRide from 'react-joyride';
import { FaPlus, FaBoxOpen, FaCog, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddProduct from './AddProduct';
import ProductForm from './manage/ProductForm';
import ProductListItem from './manage/ProductListItem';
import ManageAddOns from './ManageAddOns';
import api from '../../../api/axios-config';
import ManageProductsSkeleton from '../../skeleton/ManageProductsSkeleton';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

    const emptyProduct = { id: null, name: '', product_type: 'single', price: '', stock: '', imageUrl: '', variants: [] };

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch both products and store data
            const [productsResponse, storeResponse] = await Promise.all([
                api.get('/seller/products/my-products'),
                api.get('/seller/store')
            ]);
            
            setProducts(productsResponse.data);
            setStoreData(storeResponse.data);
            
            if (productsResponse.data.length === 0) {
                setRunTour(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
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

  const tourSteps = [
    {
      target: '.add-new-product-button',
      content: 'Click here to add your first product!',
      placement: 'bottom',
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
       <JoyRide
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#1d4ed8',
          },
        }}
      />
      <header className="mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Product Management</h1>
          {activeTab === 'products' && (
            <button onClick={handleAddNew} className="add-new-product-button flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-semibold">
              <FaPlus /> Add New Product
            </button>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaBoxOpen />
                Products
              </div>
            </button>
            {storeData?.store_type === 'restaurant' && (
              <button
                onClick={() => setActiveTab('addons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'addons'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaUtensils />
                  Add-ons
                </div>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'products' && (
          <div>
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
                    storeType={storeData?.store_type}
                />
            )}

            <div className="space-y-4">
              {products.length === 0 && !isFormVisible ? (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
                  <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
                </div>
              ) : (
                products.map(product => (
                  <ProductListItem 
                    key={product.id} 
                    product={product}
                    onSelect={handleSelectProduct}
                    onDelete={handleDelete}
                    isSelected={selectedProduct && selectedProduct.id === product.id}
                  />
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'addons' && storeData?.store_type === 'restaurant' && (
          <ManageAddOns />
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
