import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaUpload, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../../api/axios-config';

const EditAddOn = ({ addon, category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    basePrice: 0,
    isRequired: false,
    maxSelections: 1,
    variants: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addon) {
      setFormData({
        name: addon.name || '',
        description: addon.description || '',
        image: null,
        basePrice: addon.basePrice || 0,
        isRequired: addon.isRequired || false,
        maxSelections: addon.maxSelections || 1,
        variants: addon.variants || []
      });
      
      if (addon.image) {
        setImagePreview(`/api/uploads/addons/${addon.image}`);
      }
    }
  }, [addon]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: Date.now(), // Temporary ID for new variants
        name: '',
        value: '',
        priceModifier: 0,
        stock: 0,
        isUnlimitedStock: true
      }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('base_price', formData.basePrice);
      submitData.append('is_required', formData.isRequired);
      submitData.append('max_selections', formData.maxSelections);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // Add variants data
      submitData.append('variants', JSON.stringify(formData.variants));

      let response;
      if (addon?.id) {
        // Update existing addon
        response = await api.put(`/addons/${addon.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new addon
        submitData.append('addon_category_id', category.id);
        response = await api.post('/addons', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.status === 'success') {
        onSave(response.data.data);
      }
    } catch (error) {
      console.error('Error saving addon:', error);
      alert('Failed to save add-on. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {addon?.id ? 'Edit Add-on' : 'Create New Add-on'}
              </h2>
              <p className="text-blue-100 mt-1">
                Category: {category.name}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add-on Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., Coca Cola, Extra Cheese"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price (₱) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Brief description of the add-on"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add-on Image
            </label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                  <FaUpload /> Choose Image
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 400x400px, JPG or PNG
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isRequired"
                  checked={formData.isRequired}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Required Add-on
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Customers must select this add-on
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Selections
              </label>
              <input
                type="number"
                name="maxSelections"
                value={formData.maxSelections}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Add Variant
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No variants added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add variants like size options, flavors, or quantities
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={variant.id || index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Variant Name
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          placeholder="e.g., Size, Flavor"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) => updateVariant(index, 'value', e.target.value)}
                          placeholder="e.g., Large, Spicy"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price Modifier (₱)
                        </label>
                        <input
                          type="number"
                          value={variant.priceModifier}
                          onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Add-on
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddOn;
