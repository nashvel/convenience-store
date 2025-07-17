import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import EditProductModalSkeleton from '../../components/products/EditProductModalSkeleton';
import MoreVariantsModal from '../../components/products/MoreVariantsModal';
import VariantItem from '../../components/products/VariantItem';
import ConfirmationModal from '../../components/ui/Confirmation-Modal';
import Select from 'react-select';
import axios from '../../../api/axios-config';
import { XIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { TagIcon, DocumentTextIcon, CashIcon, ArchiveIcon, UploadIcon } from '@heroicons/react/outline';
import { useProductForm } from '../../hooks/useProductForm';

const EditProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
  const {
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    productImage,
    setProductImage,
    variants,
    setVariants,
    isLoading,
    setIsLoading,
    isFetchingDetails,
    selectedCategory,
    setSelectedCategory,
    categoryOptions,
    PRODUCT_ASSET_URL,
  } = useProductForm(isOpen, product, categories);

  const [isMoreVariantsModalOpen, setIsMoreVariantsModalOpen] = useState(false);
  const [variantsToUpdate, setVariantsToUpdate] = useState({});
  const [variantsToDelete, setVariantsToDelete] = useState([]);
  const [newVariantImages, setNewVariantImages] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [variantToDeleteId, setVariantToDeleteId] = useState(null);

  const handleVariantUpdate = (variantId, updatedData) => {
    setVariants(currentVariants => 
      currentVariants.map(v => v.id === variantId ? { ...v, ...updatedData } : v)
    );
  };

  const handleVariantDelete = (variantId) => {
    setVariantToDeleteId(variantId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (variantToDeleteId) {
      setVariants(currentVariants => currentVariants.filter(v => v.id !== variantToDeleteId));
      setVariantsToDelete(current => [...current, variantToDeleteId]);
      setIsConfirmModalOpen(false);
      setVariantToDeleteId(null);
    }
  };

  const handleVariantImageChange = (variantId, file) => {
    const previewUrl = URL.createObjectURL(file);
    setVariants(currentVariants => 
      currentVariants.map(v => v.id === variantId ? { ...v, newImagePreview: previewUrl } : v)
    );
    setNewVariantImages(current => ({ ...current, [variantId]: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = new FormData();
    
    // Append main product data
    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('stock', formData.stock);
    submissionData.append('category_id', selectedCategory ? selectedCategory.value : '');

    // Append main product image if changed
    if (productImage) {
      submissionData.append('image', productImage);
    }

    // Append variants data
    submissionData.append('variants', JSON.stringify(variants));

    // Append variants to delete
    if (variantsToDelete.length > 0) {
      submissionData.append('variants_to_delete', JSON.stringify(variantsToDelete));
    }

    // Append new variant images
    Object.entries(newVariantImages).forEach(([variantId, file]) => {
      submissionData.append(`variant_images[${variantId}]`, file);
    });

    try {
      await onSave(submissionData);
      onClose(); // Close the modal on success
    } catch (error) {
      // The parent component now handles error toasts, so we just log here.
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const formatOptionLabel = ({ label, level, icon }, { context, isSelected }) => {
    // The icon is white when the option is selected in the menu, otherwise it's blue.
    const iconColorClass = isSelected ? 'text-white' : 'text-blue-500';
    const newIcon = React.cloneElement(icon, { className: `h-5 w-5 mr-3 ${iconColorClass}` });

    return (
      <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
        {newIcon}
        <span>{label}</span>
      </div>
    );
  };

  const SingleValue = ({ children, ...props }) => (
    <div className="flex items-center">
      {React.cloneElement(props.data.icon, { className: 'h-5 w-5 mr-3 text-blue-500' })}
      <span className="text-gray-800">{props.data.label}</span>
    </div>
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '42px',
      borderColor: '#d1d5db',
      boxShadow: 'none',
      borderRadius: '9999px', // full radius
      paddingLeft: '8px',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
    }),
    input: (provided) => ({
      ...provided,
      caretColor: 'transparent',
    }),
  };

  const inputClass = "pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-full text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  if (!isOpen) return null;

  // Show skeleton while fetching initial data and setting up the form.
  // This ensures we don't render the form until the product is fetched AND the category sync process is complete.
  if (isFetchingDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
          <EditProductModalSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      {isFetchingDetails ? (
        <EditProductModalSkeleton />
      ) : (
        <div className="bg-blue-50 rounded-xl shadow-2xl w-full max-w-3xl animate-fade-in-up relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-8 pb-4 border-b border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800">{product ? 'Edit Product' : 'Add Product'}</h2>
            <button onClick={onClose} className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <TagIcon className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-blue-400 pointer-events-none" />
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
                </div>
              </div>
              <div>
                <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                <input
                  type="text"
                  name="store"
                  id="store"
                  value={formData.store?.name || ''}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select
                  id="category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  formatOptionLabel={formatOptionLabel}
                  styles={customStyles}
                  components={{ SingleValue }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select..."
                  isClearable
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <DocumentTextIcon className="absolute top-3 left-3 h-5 w-5 text-blue-400 pointer-events-none" />
                  <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-2xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                <div className="relative">
                  <CashIcon className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-blue-400 pointer-events-none" />
                  <input type="number" name="price" step="0.01" value={formData.price || ''} onChange={handleChange} className={inputClass} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <div className="relative">
                  <ArchiveIcon className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-blue-400 pointer-events-none" />
                  <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <div className="relative">
                <ArchiveIcon className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-blue-400 pointer-events-none" />
                <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            {(product && product.product_type === 'variable' && variants.length > 0) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Variant Images</label>
                <div className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-lg bg-white">
                    {variants.slice(0, 5).map(variant => (
                      <VariantItem 
                        key={variant.id} 
                        variant={variant} 
                        onUpdate={handleVariantUpdate}
                        onDelete={handleVariantDelete}
                        onImageChange={handleVariantImageChange}
                      />
                    ))}
                    {variants.length > 5 && (
                      <button 
                        type="button"
                        onClick={() => setIsMoreVariantsModalOpen(true)}
                        className="h-28 w-28 bg-blue-100 rounded-lg shadow-md flex flex-col items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <span className="font-bold text-2xl">+{variants.length - 5}</span>
                        <span className="text-xs font-medium mt-1">More</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mt-2 flex items-center gap-6">
                  {imagePreview && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg shadow-md" />
                    </div>
                  )}
                  <div className="w-full">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all p-6 flex flex-col justify-center items-center w-full">
                      <div className="text-center">
                        <UploadIcon className="mx-auto h-10 w-10 text-blue-400" />
                        <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input id="file-upload" name="image" type="file" onChange={handleImageChange} className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="p-8 pt-6 flex justify-end gap-4 border-t border-blue-100 bg-blue-50 sticky bottom-0">
              <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200 ease-in-out">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}\n      <MoreVariantsModal 
        isOpen={isMoreVariantsModalOpen} 
        onClose={() => setIsMoreVariantsModalOpen(false)} 
        variants={variants} 
        onUpdate={handleVariantUpdate}
        onDelete={handleVariantDelete}
        onImageChange={handleVariantImageChange}
      />

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this variant? This action cannot be undone."
      />
    </div>
  );
};

export default EditProductModal;
