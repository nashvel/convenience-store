import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EditProductModalSkeleton from '../../components/products/EditProductModalSkeleton';
import MoreVariantsModal from '../../components/products/MoreVariantsModal';
import VariantItem from '../../components/products/VariantItem';
import ConfirmationModal from '../../components/ui/Confirmation-Modal';
import Select from 'react-select';
import { XIcon, UploadIcon } from '@heroicons/react/outline';
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
  } = useProductForm(isOpen, product, categories);

  const [isMoreVariantsModalOpen, setIsMoreVariantsModalOpen] = useState(false);
  const [variantsToDelete, setVariantsToDelete] = useState([]);
  const [newVariantImages, setNewVariantImages] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [variantToDeleteId, setVariantToDeleteId] = useState(null);

  const handleVariantUpdate = (variantId, updatedData) => {
    setVariants(currentVariants =>
      currentVariants.map(v => (v.id === variantId ? { ...v, ...updatedData } : v))
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
      currentVariants.map(v => (v.id === variantId ? { ...v, newImagePreview: previewUrl } : v))
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

    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('stock', formData.stock);
    submissionData.append('category_id', selectedCategory ? selectedCategory.value : '');

    if (productImage) {
      submissionData.append('image', productImage);
    }

    submissionData.append('variants', JSON.stringify(variants));

    if (variantsToDelete.length > 0) {
      submissionData.append('variants_to_delete', JSON.stringify(variantsToDelete));
    }

    Object.entries(newVariantImages).forEach(([variantId, file]) => {
      submissionData.append(`variant_images[${variantId}]`, file);
    });

    try {
      await onSave(submissionData);
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatOptionLabel = ({ label, level }) => (
    <div style={{ paddingLeft: `${level * 20}px` }}>{label}</div>
  );

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm`}>
      {isFetchingDetails ? (
        <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
          <EditProductModalSkeleton />
        </div>
      ) : (
        <div role="dialog" aria-modal="true" className="w-full max-w-4xl h-[90vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="p-8 pb-0 flex justify-between items-start border-b border-blue-100 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
              <p className="text-sm text-gray-500 mt-1">Update product details, variants, and images.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select id="category" options={categoryOptions} value={selectedCategory} onChange={handleCategoryChange} formatOptionLabel={formatOptionLabel} styles={{ control: (base) => ({ ...base, borderRadius: '0.375rem', borderColor: '#D1D5DB' })}} placeholder="Select..." isClearable />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                {formData.product_type === 'simple' ? (
                  <>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                      <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" step="0.01" />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variants</label>
                    <div className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-lg bg-white">
                      {variants.slice(0, 5).map(variant => (
                        <VariantItem key={variant.id} variant={variant} onUpdate={handleVariantUpdate} onDelete={handleVariantDelete} onImageChange={handleVariantImageChange} />
                      ))}
                      {variants.length > 5 && (
                        <button type="button" onClick={() => setIsMoreVariantsModalOpen(true)} className="h-28 w-28 bg-blue-100 rounded-lg shadow-md flex flex-col items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
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
      )}
      <MoreVariantsModal 
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
