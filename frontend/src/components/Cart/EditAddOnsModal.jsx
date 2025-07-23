import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus, FaShoppingCart, FaUtensils, FaCoffee, FaCookie, FaEllipsisH } from 'react-icons/fa';
import api from '../../api/axios-config';
import { PRODUCT_ASSET_URL } from '../../config';

const EditAddOnsModal = ({ 
  isOpen, 
  onClose, 
  cartItem,
  onUpdateCart 
}) => {
  const [addOns, setAddOns] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const lastOperationRef = useRef(null);

  useEffect(() => {
    if (isOpen && cartItem?.store_id) {
      fetchAddOns();
      setActiveCategory(0);
      setQuantity(cartItem.quantity || 1);
    }
  }, [isOpen, cartItem]);

  useEffect(() => {
    if (isOpen && cartItem?.addOns && cartItem.addOns.length > 0) {
      // Pre-populate selected add-ons from cart item after a slight delay
      setTimeout(() => {
        populateExistingAddOns();
      }, 200);
    }
  }, [isOpen, cartItem?.addOns, addOns]);

  const fetchAddOns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/addons/store/${cartItem.store_id}`);
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

  const populateExistingAddOns = () => {
    if (!cartItem?.addOns || cartItem.addOns.length === 0) {
      return;
    }
    
    const existingAddOns = {};
    
    cartItem.addOns.forEach((addon, index) => {
      // Create a more reliable key
      const key = `${addon.category_id || 1}-${addon.addon_id}${addon.variant_id ? `-${addon.variant_id}` : ''}`;
      
      const addonPrice = parseFloat(addon.price || 0);
      const addonQuantity = parseInt(addon.quantity || 1);
      const unitPrice = addonQuantity > 0 ? addonPrice / addonQuantity : addonPrice;
      
      existingAddOns[key] = {
        categoryId: addon.category_id || 1,
        addonId: addon.addon_id,
        variantId: addon.variant_id || null,
        addon: {
          id: addon.addon_id,
          name: addon.addon_name || 'Unknown Add-on',
          base_price: unitPrice
        },
        variant: addon.variant_id ? {
          id: addon.variant_id,
          variant_value: addon.variant_value || addon.variant_name || 'Default',
          price_modifier: 0
        } : null,
        quantity: addonQuantity,
        price: unitPrice
      };
    });
    
    setSelectedAddOns(existingAddOns);
  };

  const handleAddOnSelect = (categoryId, addonId, variantId = null) => {
    // Check if this is a duplicate call within 500ms
    if (lastOperationRef.current && Date.now() - lastOperationRef.current.timestamp < 500 && 
        lastOperationRef.current.type === 'add' && 
        lastOperationRef.current.key === `${categoryId}-${addonId}-${variantId}`) {
      return;
    }
    
    lastOperationRef.current = {
      type: 'add',
      key: `${categoryId}-${addonId}-${variantId}`,
      timestamp: Date.now()
    };
    
    setSelectedAddOns(prev => {
      const key = `${categoryId}-${addonId}${variantId ? `-${variantId}` : ''}`;
      const newSelected = { ...prev };
      
      if (newSelected[key]) {
        const oldQuantity = newSelected[key].quantity;
        newSelected[key] = {
          ...newSelected[key],
          quantity: oldQuantity + 1
        };
      } else {
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
    // Check if this is a duplicate call within 500ms
    if (lastOperationRef.current && Date.now() - lastOperationRef.current.timestamp < 500 && 
        lastOperationRef.current.type === 'remove' && 
        lastOperationRef.current.key === key) {
      return;
    }
    
    lastOperationRef.current = {
      type: 'remove',
      key: key,
      timestamp: Date.now()
    };
    
    setSelectedAddOns(prev => {
      const newSelected = { ...prev };
      
      if (newSelected[key] && newSelected[key].quantity > 1) {
        const oldQuantity = newSelected[key].quantity;
        newSelected[key] = {
          ...newSelected[key],
          quantity: oldQuantity - 1
        };
      } else {
        delete newSelected[key];
      }
      return newSelected;
    });
  };

  const calculateTotal = () => {
    const productTotal = parseFloat(cartItem?.basePrice || 0) * quantity;
    const addOnsTotal = Object.values(selectedAddOns).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return productTotal + addOnsTotal;
  };

  const handleUpdateCart = async () => {
    try {
      const addOnsData = Object.values(selectedAddOns).map(addOn => ({
        addon_id: addOn.addonId,
        variant_id: addOn.variantId,
        quantity: addOn.quantity,
        price: addOn.price
      }));

      console.log('🔄 About to update cart with add-ons:', addOnsData);

      const updateData = {
        quantity,
        addOns: addOnsData
      };

      const response = await api.put(`/cart/items/${cartItem.cartItemId}`, updateData);
      console.log('✅ Cart update response:', response.data);
      
      console.log('🔄 Calling onUpdateCart to refresh cart...');
      await onUpdateCart();
      
      console.log('✅ Cart refresh completed, closing modal');
      onClose();
    } catch (error) {
      console.error('❌ Failed to update cart item:', error);
      setError('Failed to update cart item: ' + (error.response?.data?.message || error.message));
    }
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
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-blue-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={`${PRODUCT_ASSET_URL}/${cartItem?.image}`}
                alt={cartItem?.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white border-opacity-30"
              />
              <div>
                <h2 className="text-2xl font-bold">Edit Add-ons</h2>
                <p className="text-blue-100 text-lg">{cartItem?.name}</p>
                <p className="text-blue-200 text-sm">Base Price: ₱{cartItem?.basePrice?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Current Selections Section */}
          {(Object.keys(selectedAddOns).length > 0 || (cartItem?.addOns && cartItem.addOns.length > 0)) && (
            <div className="bg-blue-50 border-b border-blue-200 p-4 max-h-48 overflow-y-auto">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <FaShoppingCart className="text-blue-600" />
                Current Selections ({Object.keys(selectedAddOns).length} items)
              </h3>
              {Object.keys(selectedAddOns).length > 0 ? (
                <>
                  <div className="space-y-3">
                    {Object.values(selectedAddOns).filter(item => item && item.addon && typeof item.quantity === 'number').map((item, index) => {
                      const key = `${item.categoryId}-${item.addonId}${item.variantId ? `-${item.variantId}` : ''}`;
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-lg">{item.addon?.name || 'Unknown Add-on'}</h4>
                              {item.variant && (
                                <p className="text-sm text-blue-600 mt-1">
                                  {item.variant.variant_value}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mt-2">
                                ₱{(item.price || 0).toFixed(2)} each × {item.quantity || 0} = <span className="font-semibold text-blue-700">₱{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <button
                                onClick={() => handleAddOnDeselect(key)}
                                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md"
                                title="Remove one"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <span className="w-10 text-center font-bold text-lg text-gray-800">{item.quantity || 0}</span>
                              <button
                                onClick={() => handleAddOnSelect(item.categoryId, item.addonId, item.variantId)}
                                className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-md"
                                title="Add one more"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <p className="text-lg font-bold text-blue-800 text-center">
                      Add-ons Total: ₱{Object.values(selectedAddOns).filter(item => item && typeof item.quantity === 'number' && typeof item.price === 'number').reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading your current selections...</p>
                  {cartItem?.addOns && cartItem.addOns.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm text-blue-600">Found {cartItem.addOns.length} add-on(s) in cart</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Debug: selectedAddOns keys = {Object.keys(selectedAddOns).length}</p>
                        <p>Cart addOns: {JSON.stringify(cartItem.addOns.map(a => ({name: a.addon_name, price: a.price, qty: a.quantity})))}</p>
                      </div>
                      <button 
                        onClick={populateExistingAddOns}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No add-ons found in cart item</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col" style={{ height: (Object.keys(selectedAddOns).length > 0 || (cartItem?.addOns && cartItem.addOns.length > 0)) ? 'calc(95vh - 450px)' : 'calc(95vh - 300px)' }}>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading add-ons...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-red-600">
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={fetchAddOns}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : addOns.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaUtensils className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No add-ons available for this restaurant</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-gray-50 border-r overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {addOns.map((category, index) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(index)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                            activeCategory === index
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{getCategoryIcon(category.name)}</span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs opacity-75">{category.addons?.length || 0} items</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      {getCategoryIcon(addOns[activeCategory]?.name)}
                      {addOns[activeCategory]?.name}
                    </h3>
                    
                    <div className="space-y-4">
                      {addOns[activeCategory]?.addons?.map((addon) => (
                        <div key={addon.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{addon.name}</h4>
                              {addon.description && (
                                <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                              )}
                              <p className="text-blue-600 font-semibold mt-2">₱{parseFloat(addon.base_price).toFixed(2)}</p>
                            </div>
                          </div>

                          {addon.variants && addon.variants.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">Options:</p>
                              {addon.variants.map((variant) => {
                                const key = `${addOns[activeCategory].id}-${addon.id}-${variant.id}`;
                                const isSelected = selectedAddOns[key];
                                const totalPrice = parseFloat(addon.base_price) + parseFloat(variant.price_modifier || 0);

                                return (
                                  <div key={variant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-800">
                                        {variant.variant_name}: {variant.variant_value}
                                      </span>
                                      {variant.price_modifier > 0 && (
                                        <span className="text-green-600 text-sm ml-2">+₱{parseFloat(variant.price_modifier).toFixed(2)}</span>
                                      )}
                                      <div className="text-sm text-gray-600">
                                        Total: ₱{totalPrice.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isSelected && (
                                        <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                                          <button
                                            onClick={() => handleAddOnDeselect(key)}
                                            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                          >
                                            <FaMinus />
                                          </button>
                                          <span className="w-8 text-center font-medium">{isSelected.quantity}</span>
                                          <button
                                            onClick={() => handleAddOnSelect(addOns[activeCategory].id, addon.id, variant.id)}
                                            className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                          >
                                            <FaPlus />
                                          </button>
                                        </div>
                                      )}
                                      {!isSelected && (
                                        <button
                                          onClick={() => handleAddOnSelect(addOns[activeCategory].id, addon.id, variant.id)}
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
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                {addon.stock_quantity !== null && addon.stock_quantity !== undefined && (
                                  <span>Stock: {addon.stock_quantity}</span>
                                )}
                              </div>
                              {(() => {
                                const key = `${addOns[activeCategory].id}-${addon.id}`;
                                const isSelected = selectedAddOns[key];
                                
                                if (isSelected) {
                                  return (
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                      <button
                                        onClick={() => handleAddOnDeselect(key)}
                                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                      >
                                        <FaMinus />
                                      </button>
                                      <span className="w-8 text-center font-medium">{isSelected.quantity}</span>
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
                </div>
              </div>
            )}
          </div>

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
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FaShoppingCart />
                Update Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditAddOnsModal;
