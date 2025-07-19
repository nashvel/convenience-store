import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaEyeSlash, FaUtensils, FaCoffee, FaHamburger, FaCookie, FaGift, FaTag, FaStar, FaInfoCircle } from 'react-icons/fa';
import api from '../../../api/axios-config';

const ManageAddOns = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAddon, setEditingAddon] = useState(null);
  const [showAddAddonForm, setShowAddAddonForm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddOn, setNewAddOn] = useState({
    name: '',
    description: '',
    category: 'Beverages',
    basePrice: 0,
    isRequired: false,
    maxSelections: 1,
    variants: [{ name: 'Regular', value: 'Regular', priceModifier: 0, stock: 100 }]
  });

  // Fetch add-ons data from API
  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      
      // Use the same pattern as admin ProductList - simple direct API call
      const response = await api.get('/test/pizza-palace-addons');
      
      if (response.data && response.data.status === 'success') {
        // Transform API data to match component structure
        const transformedCategories = response.data.data.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          isActive: category.is_active,
          addons: category.addons.map(addon => ({
            id: addon.id,
            name: addon.name,
            description: addon.description,
            image: addon.image,
            basePrice: parseFloat(addon.base_price),
            isRequired: addon.is_required === '1' || addon.is_required === 1,
            maxSelections: parseInt(addon.max_selections),
            isActive: addon.is_active,
            variants: addon.variants.map(variant => ({
              id: variant.id,
              name: variant.variant_name,
              value: variant.variant_value,
              priceModifier: parseFloat(variant.price_modifier),
              stock: parseInt(variant.stock_quantity),
              isUnlimitedStock: variant.is_unlimited_stock === '1' || variant.is_unlimited_stock === 1,
              isActive: variant.is_active
            }))
          }))
        }));
        setCategories(transformedCategories);
      } else {
        // Empty response - no add-ons yet
        setCategories([]);
      }
    } catch (err) {
      setError('Failed to fetch add-ons. Please try again later.');
      console.error('Failed to fetch add-ons:', err);
    } finally {
      setLoading(false);
    }
  };



  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your add-ons...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAddOns}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  // Filter add-ons based on selected category
  const getFilteredAddOns = () => {
    let allAddOns = [];
    categories.forEach(category => {
      category.addons.forEach(addon => {
        allAddOns.push({ ...addon, categoryName: category.name, categoryId: category.id });
      });
    });

    if (selectedCategory !== 'all') {
      allAddOns = allAddOns.filter(addon => addon.categoryId.toString() === selectedCategory);
    }

    return allAddOns;
  };

  const filteredAddOns = getFilteredAddOns();



  // Handle adding new add-on
  const handleAddNewAddOn = async () => {
    if (!newAddOn.name.trim()) return;
    
    try {
      // Here you would typically make an API call to save the add-on
      // For now, we'll just add it to the local state
      const addOnToAdd = {
        id: Date.now(),
        ...newAddOn,
        basePrice: parseFloat(newAddOn.basePrice) || 0,
        isActive: true
      };
      
      // Reset form
      setNewAddOn({
        name: '',
        description: '',
        category: 'Beverages',
        basePrice: 0,
        isRequired: false,
        maxSelections: 1,
        variants: [{ name: 'Regular', value: 'Regular', priceModifier: 0, stock: 100 }]
      });
      setShowAddForm(false);
      
      // Refresh the add-ons list
      fetchAddOns();
      
    } catch (error) {
      console.error('Error adding add-on:', error);
    }
  };

  // Add variant to new add-on
  const addVariantToNew = () => {
    setNewAddOn({
      ...newAddOn,
      variants: [...newAddOn.variants, { name: '', value: '', priceModifier: 0, stock: 0 }]
    });
  };

  // Update variant in new add-on
  const updateNewVariant = (index, field, value) => {
    const updatedVariants = newAddOn.variants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    setNewAddOn({ ...newAddOn, variants: updatedVariants });
  };

  // Delete variant from new add-on
  const deleteNewVariant = (index) => {
    if (newAddOn.variants.length > 1) {
      const updatedVariants = newAddOn.variants.filter((_, i) => i !== index);
      setNewAddOn({ ...newAddOn, variants: updatedVariants });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">CATEGORIES</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm"
              title="Add New Add-on"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* All Categories */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === 'all'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaUtensils className="text-lg" />
              <span className="font-medium">All Add-ons</span>
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {categories.reduce((acc, cat) => acc + cat.addons.length, 0)}
              </span>
            </button>

            {/* Individual Categories */}
            {categories.map((category) => {
              const getCategoryIcon = (name) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('beverage') || lowerName.includes('drink')) return <FaCoffee className="text-lg" />;
                if (lowerName.includes('side') || lowerName.includes('appetizer')) return <FaHamburger className="text-lg" />;
                if (lowerName.includes('dessert') || lowerName.includes('sweet')) return <FaCookie className="text-lg" />;
                if (lowerName.includes('extra')) return <FaGift className="text-lg" />;
                return <FaUtensils className="text-lg" />;
              };

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 flex items-center gap-3 ${
                    selectedCategory === category.id.toString()
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{category.name}</div>
                    <div className="text-xs text-gray-500 truncate">{category.description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium min-w-[24px] text-center">
                      {category.addons.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add-ons Management</h1>
              <p className="text-gray-600">Manage additional items and options for your restaurant products</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaTag className="text-blue-500" />
                <span>{categories.length} Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHamburger className="text-green-500" />
                <span>{categories.reduce((acc, cat) => acc + cat.addons.length, 0)} Add-ons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaUtensils className="mx-auto text-4xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Add-ons Available</h3>
              <p className="text-gray-500 mb-4">
                Add-on categories and items are managed by administrators. Contact your admin to set up add-ons for your restaurant.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <FaInfoCircle />
                  <span className="font-medium">Note:</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Only administrators can create and manage add-on categories. This ensures consistency across the platform.
                </p>
              </div>
            </div>
          ) : filteredAddOns.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaUtensils className="mx-auto text-4xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Add-ons Found</h3>
              <p className="text-gray-500">Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAddOns.map((addon) => (
                <div key={addon.id} className="group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    {addon.image ? (
                      <img
                        src={`/uploads/addons/${addon.image}`}
                        alt={addon.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { 
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTA1LjUyMyA3MCAxMTAgNzQuNDc3IDExMCA4MFY5MEMxMTAgOTUuNTIzIDEwNS41MjMgMTAwIDEwMCAxMDBDOTQuNDc3IDEwMCA5MCA5NS41MjMgOTAgOTBWODBDOTAgNzQuNDc3IDk0LjQ3NyA3MCAxMDAgNzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMzAgMTIwSDcwQzY0LjQ3NyAxMjAgNjAgMTI0LjQ3NyA2MCAxMzBWMTQwQzYwIDE0NS41MjMgNjQuNDc3IDE1MCA3MCAxNTBIMTMwQzEzNS41MjMgMTUwIDE0MCAxNDUuNTIzIDE0MCAxNDBWMTMwQzE0MCAxMjQuNDc3IDEzNS41MjMgMTIwIDEzMCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='; 
                        }}
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FaUtensils className="text-gray-400 text-4xl" />
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                        {addon.categoryName}
                      </span>
                    </div>
                    
                    {/* Required Badge */}
                    {addon.isRequired && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <FaStar className="text-xs" /> Required
                        </span>
                      </div>
                    )}
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => { /* handleEditAddon(addon) */ }} 
                          className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-blue-600 hover:text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110" 
                          title="Edit Add-on"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button 
                          className="bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-gray-600 hover:text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110" 
                          title={addon.isActive ? 'Hide Add-on' : 'Show Add-on'}
                        >
                          {addon.isActive ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-xl leading-tight truncate">{addon.name}</h3>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                          ₱{addon.basePrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {addon.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{addon.description}</p>
                    )}
                    
                    {/* Variants */}
                    {addon.variants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Available Options</p>
                        <div className="flex flex-wrap gap-2">
                          {addon.variants.slice(0, 3).map((variant) => (
                            <span key={variant.id} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-medium">
                              {variant.value}
                            </span>
                          ))}
                          {addon.variants.length > 3 && (
                            <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium">
                              +{addon.variants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          addon.isActive ? 'bg-green-400 shadow-green-400/50 shadow-lg' : 'bg-gray-400'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          addon.isActive ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {addon.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        ID: {addon.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add New Add-on Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <FaPlus className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Add New Add-on</h3>
                    <p className="text-sm text-gray-600">Create a new add-on for your restaurant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newAddOn.name}
                      onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })}
                      placeholder="e.g., Coca Cola"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newAddOn.category}
                      onChange={(e) => setNewAddOn({ ...newAddOn, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newAddOn.description}
                    onChange={(e) => setNewAddOn({ ...newAddOn, description: e.target.value })}
                    placeholder="Brief description of the add-on"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="3"
                  />
                </div>
                
                {/* Pricing and Options */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ( ₱) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAddOn.basePrice}
                      onChange={(e) => setNewAddOn({ ...newAddOn, basePrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Selections</label>
                    <input
                      type="number"
                      value={newAddOn.maxSelections}
                      onChange={(e) => setNewAddOn({ ...newAddOn, maxSelections: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddOn.isRequired}
                        onChange={(e) => setNewAddOn({ ...newAddOn, isRequired: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">Required</span>
                    </label>
                  </div>
                </div>
                
                {/* Variants */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Variants</label>
                    <button
                      type="button"
                      onClick={addVariantToNew}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 font-medium"
                    >
                      <FaPlus /> Add Variant
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newAddOn.variants.map((variant, index) => (
                      <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateNewVariant(index, 'name', e.target.value)}
                          placeholder="Name (e.g., Size)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={variant.value}
                          onChange={(e) => updateNewVariant(index, 'value', e.target.value)}
                          placeholder="Value (e.g., Large)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={variant.priceModifier}
                          onChange={(e) => updateNewVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                          placeholder="Price modifier"
                          className="w-28 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateNewVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          placeholder="Stock"
                          className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        {newAddOn.variants.length > 1 && (
                          <button
                            onClick={() => deleteNewVariant(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleAddNewAddOn}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <FaSave /> Create Add-on
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAddOns;
