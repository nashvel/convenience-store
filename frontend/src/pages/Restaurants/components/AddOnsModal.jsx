import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus, FaShoppingCart, FaUtensils, FaCoffee, FaCookie, FaEllipsisH, FaChevronDown } from 'react-icons/fa';
import api from '../../../api/axios-config';
import { PRODUCT_ASSET_URL, ADDON_ASSET_URL } from '../../../config';

const AddOnsModal = ({ 
  isOpen, 
  onClose, 
  product, 
  restaurant, 
  onAddToCart 
}) => {
  const [addOns, setAddOns] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showSkipOption, setShowSkipOption] = useState(true);
  const [expandedAddOns, setExpandedAddOns] = useState({});

  useEffect(() => {
    if (isOpen && restaurant?.id) {
      fetchAddOns();
      setActiveCategory(0);
      setSelectedAddOns({});
      setQuantity(1);
      setExpandedAddOns({});
    }
  }, [isOpen, restaurant?.id]);

  const toggleAddonExpanded = (addonId) => {
    setExpandedAddOns(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  const fetchAddOns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/addons/store/${restaurant.id}`);
      if (response.data.status === 'success') {
        setAddOns(response.data.data);
      } else {
        setError('Failed to load add-ons');
      }
    } catch (err) {
      console.error('Error fetching add-ons:', err);
      setError('Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOnSelect = (categoryId, addonId, variantId = null, event = null) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedAddOns(prev => {
      const key = `${categoryId}-${addonId}${variantId ? `-${variantId}` : ''}`;
      const newSelected = { ...prev };
      
      if (newSelected[key]) {
        // Increment existing add-on quantity by 1
        newSelected[key] = {
          ...newSelected[key],
          quantity: newSelected[key].quantity + 1
        };
      } else {
        // Create new add-on entry
        const category = addOns.find(cat => cat.id === categoryId);
        const addon = category?.addons.find(addon => addon.id === addonId);
        const variant = variantId ? addon?.variants.find(v => v.id === variantId) : null;
        
        newSelected[key] = {
          categoryId,
          addonId,
          variantId,
          addon,
          variant,
          quantity: 1,
          price: parseFloat(addon?.base_price || 0) + parseFloat(variant?.price_modifier || 0)
        };
      }
      
      return newSelected;
    });
  };

  const handleAddOnDeselect = (key) => {
    setSelectedAddOns(prev => {
      const newSelected = { ...prev };
      if (newSelected[key].quantity > 1) {
        newSelected[key].quantity -= 1;
      } else {
        delete newSelected[key];
      }
      return newSelected;
    });
  };

  const calculateTotal = () => {
    const productTotal = parseFloat(product?.price || 0) * quantity;
    const addOnsTotal = Object.values(selectedAddOns).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return productTotal + addOnsTotal;
  };

  const handleAddToCart = () => {
    // Format add-ons data for backend API
    const addOnsData = Object.values(selectedAddOns).map(addOn => ({
      addon_id: addOn.addonId,
      variant_id: addOn.variantId,
      quantity: addOn.quantity,
      price: addOn.price
    }));

    const cartItem = {
      ...product,
      quantity,
      addOns: addOnsData
    };
    
    onAddToCart(cartItem);
    onClose();
  };

  const handleSkipAddOns = () => {
    const cartItem = {
      ...product,
      quantity,
      addOns: [],
      totalPrice: parseFloat(product?.price || 0) * quantity
    };
    onAddToCart(cartItem);
    onClose();
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('beverage') || name.includes('drink')) return <FaCoffee />;
    if (name.includes('dessert') || name.includes('sweet')) return <FaCookie />;
    if (name.includes('side') || name.includes('extra')) return <FaUtensils />;
    return <FaEllipsisH />;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
            >
              <FaTimes />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={product?.image ? `${PRODUCT_ASSET_URL}/${product.image}` : 'https://via.placeholder.com/80x80'}
                alt={product?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{product?.name}</h2>
                <p className="text-white/90">Customize your order</p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          {addOns.length > 0 && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto scrollbar-hide">
                {addOns.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(index)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === index
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {getCategoryIcon(category.name)}
                    {category.name}
                    {category.addons?.length > 0 && (
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {category.addons.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[45vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading add-ons...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchAddOns}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Try again
                </button>
              </div>
            ) : addOns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No add-ons available for this restaurant.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {addOns.length > 0 && addOns[activeCategory] && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="text-2xl text-blue-600">
                          {getCategoryIcon(addOns[activeCategory].name)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {addOns[activeCategory].name}
                        </h3>
                      </div>
                      {addOns[activeCategory].description && (
                        <p className="text-gray-600 text-sm">
                          {addOns[activeCategory].description}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {addOns[activeCategory].addons?.map((addon) => (
                        <div key={addon.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              {addon.image && (
                                <img
                                  src={`${ADDON_ASSET_URL}/${addon.image}`}
                                  alt={addon.name}
                                  className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-lg">{addon.name}</h4>
                                {addon.description && (
                                  <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <div className="text-right">
                                <span className="text-lg font-bold text-blue-600">
                                  ₱{parseFloat(addon.base_price).toFixed(2)}
                                </span>
                              </div>
                              {addon.variants && addon.variants.length > 0 && (
                                <button
                                  onClick={() => toggleAddonExpanded(addon.id)}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                  title={expandedAddOns[addon.id] ? 'Hide options' : 'Show options'}
                                >
                                  <FaChevronDown 
                                    className={`text-gray-600 transition-transform duration-200 ${
                                      expandedAddOns[addon.id] ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {addon.variants && addon.variants.length > 0 && expandedAddOns[addon.id] && (
                            <div className="space-y-2">
                              {addon.variants.map((variant) => {
                                const key = `${addOns[activeCategory].id}-${addon.id}-${variant.id}`;
                                const selected = selectedAddOns[key];
                                const totalPrice = parseFloat(addon.base_price) + parseFloat(variant.price_modifier || 0);
                                
                                return (
                                  <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-800">{variant.variant_value}</span>
                                      {variant.price_modifier > 0 && (
                                        <span className="text-sm text-green-600 ml-2 font-medium">
                                          +₱{parseFloat(variant.price_modifier).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-blue-600">
                                        ₱{totalPrice.toFixed(2)}
                                      </span>
                                      {selected ? (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleAddOnDeselect(key)}
                                            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                          >
                                            <FaMinus />
                                          </button>
                                          <span className="w-8 text-center font-bold text-gray-800">
                                            {selected.quantity}
                                          </span>
                                          <button
                                            onClick={(e) => handleAddOnSelect(addOns[activeCategory].id, addon.id, variant.id, e)}
                                            className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                          >
                                            <FaPlus />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={(e) => handleAddOnSelect(addOns[activeCategory].id, addon.id, variant.id, e)}
                                          className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                        >
                                          <FaPlus />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {(!addon.variants || addon.variants.length === 0) && (
                            <div className="flex items-center justify-end mt-3">
                              {(() => {
                                const key = `${addOns[activeCategory].id}-${addon.id}`;
                                const selected = selectedAddOns[key];
                                
                                if (selected) {
                                  return (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleAddOnDeselect(key)}
                                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                      >
                                        <FaMinus />
                                      </button>
                                      <span className="w-8 text-center font-bold text-gray-800">
                                        {selected.quantity}
                                      </span>
                                      <button
                                        onClick={() => handleAddOnSelect(addOns[activeCategory].id, addon.id)}
                                        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                      >
                                        <FaPlus />
                                      </button>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <button
                                      onClick={() => handleAddOnSelect(addOns[activeCategory].id, addon.id)}
                                      className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                    >
                                      <FaPlus />
                                    </button>
                                  );
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-5 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-xl font-bold text-blue-600">
                  ₱{calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkipAddOns}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Skip Add-ons
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaShoppingCart />
                {Object.keys(selectedAddOns).length > 0 ? 'Add with Add-ons' : 'Add to Cart'}
              </button>
            </div>
            
            {/* Add-ons Summary */}
            {Object.keys(selectedAddOns).length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Selected Add-ons:</h4>
                <div className="space-y-1">
                  {Object.values(selectedAddOns).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-blue-700">
                      <span>
                        {item.addon.name}
                        {item.variant && ` (${item.variant.variant_value})`}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddOnsModal;
