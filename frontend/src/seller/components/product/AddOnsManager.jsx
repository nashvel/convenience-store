import React, { useState } from 'react';
import { FaPlus, FaUtensils, FaCoffee, FaHamburger, FaCookie, FaGift, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AddOnsManager = ({ addons, setAddons }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [newAddon, setNewAddon] = useState({
    name: '',
    description: '',
    category: 'Beverages',
    basePrice: 0,
    isRequired: false,
    maxSelections: 1,
    variants: [{ name: 'Regular', value: 'Regular', priceModifier: 0, stock: 100 }]
  });

  const categories = [
    { name: 'Beverages', icon: FaCoffee, color: 'bg-amber-500' },
    { name: 'Sides', icon: FaHamburger, color: 'bg-orange-500' },
    { name: 'Desserts', icon: FaCookie, color: 'bg-pink-500' },
    { name: 'Extras', icon: FaGift, color: 'bg-purple-500' }
  ];

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : FaUtensils;
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'bg-gray-500';
  };

  const handleAddAddon = () => {
    if (newAddon.name.trim()) {
      const addon = {
        id: Date.now(),
        ...newAddon,
        basePrice: parseFloat(newAddon.basePrice) || 0
      };
      setAddons([...addons, addon]);
      setNewAddon({
        name: '',
        description: '',
        category: 'Beverages',
        basePrice: 0,
        isRequired: false,
        maxSelections: 1,
        variants: [{ name: 'Regular', value: 'Regular', priceModifier: 0, stock: 100 }]
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteAddon = (addonId) => {
    setAddons(addons.filter(addon => addon.id !== addonId));
  };

  const handleEditAddon = (addon) => {
    setEditingAddon({ ...addon });
  };

  const handleSaveEdit = () => {
    setAddons(addons.map(addon => 
      addon.id === editingAddon.id ? editingAddon : addon
    ));
    setEditingAddon(null);
  };

  const addVariant = (addonId) => {
    if (editingAddon && editingAddon.id === addonId) {
      setEditingAddon({
        ...editingAddon,
        variants: [...editingAddon.variants, { name: '', value: '', priceModifier: 0, stock: 0 }]
      });
    }
  };

  const updateVariant = (variantIndex, field, value) => {
    if (editingAddon) {
      const updatedVariants = editingAddon.variants.map((variant, index) =>
        index === variantIndex ? { ...variant, [field]: value } : variant
      );
      setEditingAddon({ ...editingAddon, variants: updatedVariants });
    }
  };

  const deleteVariant = (variantIndex) => {
    if (editingAddon && editingAddon.variants.length > 1) {
      const updatedVariants = editingAddon.variants.filter((_, index) => index !== variantIndex);
      setEditingAddon({ ...editingAddon, variants: updatedVariants });
    }
  };

  return (
    <div className="space-y-4">
      {/* Add-ons List */}
      {addons.length > 0 && (
        <div className="space-y-3">
          {addons.map((addon) => {
            const IconComponent = getCategoryIcon(addon.category);
            const isEditing = editingAddon && editingAddon.id === addon.id;
            
            return (
              <div key={addon.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingAddon.name}
                          onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={editingAddon.category}
                          onChange={(e) => setEditingAddon({ ...editingAddon, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {categories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingAddon.description}
                        onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingAddon.basePrice}
                          onChange={(e) => setEditingAddon({ ...editingAddon, basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Selections</label>
                        <input
                          type="number"
                          value={editingAddon.maxSelections}
                          onChange={(e) => setEditingAddon({ ...editingAddon, maxSelections: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingAddon.isRequired}
                            onChange={(e) => setEditingAddon({ ...editingAddon, isRequired: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Variants */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Variants</label>
                        <button
                          type="button"
                          onClick={() => addVariant(editingAddon.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <FaPlus /> Add Variant
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editingAddon.variants.map((variant, index) => (
                          <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => updateVariant(index, 'name', e.target.value)}
                              placeholder="Name (e.g., Size)"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={variant.value}
                              onChange={(e) => updateVariant(index, 'value', e.target.value)}
                              placeholder="Value (e.g., Large)"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={variant.priceModifier}
                              onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                              placeholder="Price modifier"
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                              placeholder="Stock"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            {editingAddon.variants.length > 1 && (
                              <button
                                onClick={() => deleteVariant(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() => setEditingAddon(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${getCategoryColor(addon.category)} p-2 rounded-lg`}>
                        <IconComponent className="text-white text-sm" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{addon.name}</h4>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            ${typeof addon.basePrice === 'number' ? addon.basePrice.toFixed(2) : '0.00'}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {addon.category}
                          </span>
                          {addon.isRequired && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditAddon(addon)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAddon(addon.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Add-on Form */}
      {showAddForm ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-blue-300 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Add New Add-on</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                  placeholder="e.g., Coca Cola"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newAddon.category}
                  onChange={(e) => setNewAddon({ ...newAddon, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newAddon.description}
                onChange={(e) => setNewAddon({ ...newAddon, description: e.target.value })}
                placeholder="Brief description of the add-on"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAddon.basePrice}
                  onChange={(e) => setNewAddon({ ...newAddon, basePrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Selections</label>
                <input
                  type="number"
                  value={newAddon.maxSelections}
                  onChange={(e) => setNewAddon({ ...newAddon, maxSelections: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newAddon.isRequired}
                    onChange={(e) => setNewAddon({ ...newAddon, isRequired: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Required</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleAddAddon}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <FaPlus /> Add Add-on
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-white border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-600 font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <FaPlus /> Add New Add-on
        </button>
      )}

      {addons.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <FaUtensils className="mx-auto text-4xl mb-3 text-gray-300" />
          <p className="text-lg font-medium">No add-ons yet</p>
          <p className="text-sm">Click "Add New Add-on" to get started</p>
        </div>
      )}
    </div>
  );
};

export default AddOnsManager;
