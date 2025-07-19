import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaGripVertical } from 'react-icons/fa';

const AddOns = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Drinks',
      description: 'Refreshing beverages',
      addons: [
        {
          id: 1,
          name: 'Coca Cola',
          description: 'Classic refreshing cola',
          basePrice: 2.50,
          isRequired: false,
          maxSelections: 1,
          variants: [
            { id: 1, name: 'Size', value: 'Small', priceModifier: 0, stock: 100 },
            { id: 2, name: 'Size', value: 'Medium', priceModifier: 0.50, stock: 80 },
            { id: 3, name: 'Size', value: 'Large', priceModifier: 1.00, stock: 60 }
          ]
        },
        {
          id: 2,
          name: 'Orange Juice',
          description: 'Fresh squeezed orange juice',
          basePrice: 3.00,
          isRequired: false,
          maxSelections: 1,
          variants: [
            { id: 4, name: 'Size', value: 'Regular', priceModifier: 0, stock: 50 },
            { id: 5, name: 'Size', value: 'Large', priceModifier: 1.00, stock: 30 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Sides',
      description: 'Delicious side dishes',
      addons: [
        {
          id: 3,
          name: 'Garlic Bread',
          description: 'Crispy garlic bread',
          basePrice: 4.50,
          isRequired: false,
          maxSelections: 2,
          variants: [
            { id: 6, name: 'Quantity', value: 'Regular', priceModifier: 0, stock: 25 }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Extras',
      description: 'Additional toppings and extras',
      addons: [
        {
          id: 4,
          name: 'Extra Cheese',
          description: 'Additional mozzarella cheese',
          basePrice: 1.50,
          isRequired: false,
          maxSelections: 3,
          variants: [
            { id: 7, name: 'Amount', value: 'Regular', priceModifier: 0, stock: 100 }
          ]
        }
      ]
    }
  ]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAddon, setEditingAddon] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddAddonForm, setShowAddAddonForm] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newAddon, setNewAddon] = useState({
    name: '',
    description: '',
    basePrice: 0,
    isRequired: false,
    maxSelections: 1,
    variants: [{ name: '', value: '', priceModifier: 0, stock: 0 }]
  });

  const addCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: Date.now(),
        name: newCategory.trim(),
        addons: []
      };
      setCategories([...categories, newCat]);
      setNewCategory('');
    }
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const updateCategoryName = (categoryId, newName) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, name: newName } : cat
    ));
    setEditingCategory(null);
  };

  const addAddonToCategory = (categoryId) => {
    const newAddon = {
      id: Date.now(),
      name: 'New Add-on',
      description: '',
      basePrice: 0,
      isRequired: false,
      maxSelections: 1,
      variants: [{ name: 'Regular', value: 'Regular', priceModifier: 0, stock: 0 }]
    };
    
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, addons: [...cat.addons, newAddon] }
        : cat
    ));
    setEditingAddon(newAddon.id);
  };

  const updateAddon = (categoryId, addonId, updatedAddon) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            addons: cat.addons.map(addon => 
              addon.id === addonId ? updatedAddon : addon
            )
          }
        : cat
    ));
  };

  const deleteAddon = (categoryId, addonId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, addons: cat.addons.filter(addon => addon.id !== addonId) }
        : cat
    ));
  };

  const addVariantToAddon = (categoryId, addonId) => {
    const newVariant = { size: '', price: 0, stock: 0 };
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            addons: cat.addons.map(addon => 
              addon.id === addonId 
                ? { ...addon, variants: [...addon.variants, newVariant] }
                : addon
            )
          }
        : cat
    ));
  };

  const updateVariant = (categoryId, addonId, variantIndex, field, value) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            addons: cat.addons.map(addon => 
              addon.id === addonId 
                ? { 
                    ...addon, 
                    variants: addon.variants.map((variant, index) => 
                      index === variantIndex 
                        ? { ...variant, [field]: value }
                        : variant
                    )
                  }
                : addon
            )
          }
        : cat
    ));
  };

  const deleteVariant = (categoryId, addonId, variantIndex) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            addons: cat.addons.map(addon => 
              addon.id === addonId 
                ? { 
                    ...addon, 
                    variants: addon.variants.filter((_, index) => index !== variantIndex)
                  }
                : addon
            )
          }
        : cat
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          🍕 Restaurant Add-ons
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Manage additional items and options for your restaurant
        </p>
      </div>

      {/* Add New Category */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category (e.g., Beverages, Desserts)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      defaultValue={category.name}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateCategoryName(category.id, e.target.value);
                        }
                      }}
                      className="bg-white text-gray-800 px-3 py-1 rounded border-0 focus:ring-2 focus:ring-white"
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        updateCategoryName(category.id, input.value);
                      }}
                      className="text-white hover:text-gray-200"
                    >
                      <FaSave />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold">{category.name}</h4>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
                      {category.addons.length} items
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                    className="text-white hover:text-gray-200 p-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => addAddonToCategory(category.id)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors"
                  >
                    <FaPlus /> Add Item
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-white hover:text-red-200 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>

            {/* Add-ons List */}
            <div className="p-4">
              {category.addons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaPlus className="mx-auto text-3xl mb-2 opacity-50" />
                  <p>No add-ons yet. Click "Add Item" to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {category.addons.map((addon) => (
                    <AddonItem
                      key={addon.id}
                      addon={addon}
                      categoryId={category.id}
                      isEditing={editingAddon === addon.id}
                      onEdit={() => setEditingAddon(editingAddon === addon.id ? null : addon.id)}
                      onUpdate={(updatedAddon) => updateAddon(category.id, addon.id, updatedAddon)}
                      onDelete={() => deleteAddon(category.id, addon.id)}
                      onAddVariant={() => addVariantToAddon(category.id, addon.id)}
                      onUpdateVariant={(variantIndex, field, value) => 
                        updateVariant(category.id, addon.id, variantIndex, field, value)
                      }
                      onDeleteVariant={(variantIndex) => 
                        deleteVariant(category.id, addon.id, variantIndex)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddonItem = ({ 
  addon, 
  categoryId, 
  isEditing, 
  onEdit, 
  onUpdate, 
  onDelete, 
  onAddVariant, 
  onUpdateVariant, 
  onDeleteVariant 
}) => {
  const [localAddon, setLocalAddon] = useState(addon);

  const handleSave = () => {
    onUpdate(localAddon);
    onEdit();
  };

  const handleCancel = () => {
    setLocalAddon(addon);
    onEdit();
  };

  if (isEditing) {
    return (
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add-on Name</label>
            <input
              type="text"
              value={localAddon.name}
              onChange={(e) => setLocalAddon({ ...localAddon, name: e.target.value })}
              placeholder="Add-on name (e.g., Coca Cola)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($)</label>
            <input
              type="number"
              value={localAddon.price}
              onChange={(e) => setLocalAddon({ ...localAddon, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localAddon.isRequired}
                onChange={(e) => setLocalAddon({ ...localAddon, isRequired: e.target.checked })}
                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Required add-on</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Selections</label>
            <input
              type="number"
              value={localAddon.maxSelections}
              onChange={(e) => setLocalAddon({ ...localAddon, maxSelections: parseInt(e.target.value) || 1 })}
              placeholder="1"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-700">Size/Variants</h5>
            <button
              onClick={onAddVariant}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 font-medium transition-colors"
            >
              <FaPlus /> Add Variant
            </button>
          </div>
          <div className="space-y-2">
            {localAddon.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 items-center bg-white p-2 rounded border">
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => onUpdateVariant(index, 'size', e.target.value)}
                  placeholder="Size (e.g., Small, Large)"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  value={variant.priceModifier}
                  onChange={(e) => onUpdateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                  placeholder="Price modifier"
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => onUpdateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                  placeholder="Stock"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                {localAddon.variants.length > 1 && (
                  <button
                    onClick={() => onDeleteVariant(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <FaSave /> Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h5 className="font-semibold text-gray-800">{addon.name || 'Unnamed Add-on'}</h5>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              ${typeof addon.basePrice === 'number' ? addon.basePrice.toFixed(2) : '0.00'}
            </span>
            {addon.isRequired && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                Required
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {addon.variants.map((variant, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {variant.value || variant.name} (+${typeof variant.priceModifier === 'number' ? variant.priceModifier.toFixed(2) : '0.00'}) - Stock: {variant.stock}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
            title="Edit add-on"
          >
            <FaEdit />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Delete add-on"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOns;
