import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaEdit } from 'react-icons/fa';
import { PRODUCT_ASSET_URL } from '../../config';
import EditAddOnsModal from './EditAddOnsModal';

const CartItem = ({ item, onUpdateQuantity, onRemove, onSelectItem, isSelected, onRefreshCart }) => {
  const [showEditAddOnsModal, setShowEditAddOnsModal] = useState(false);
  
  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  const handleEditAddOns = () => {
    setShowEditAddOnsModal(true);
  };

  const handleUpdateCart = () => {
    setShowEditAddOnsModal(false);
    if (onRefreshCart) {
      onRefreshCart();
    }
  };

  return (
    <div className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
      <div className="relative">
        <input
          type="checkbox"
          className="h-5 w-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
          checked={isSelected}
          onChange={() => onSelectItem(item.cartItemId)}
        />
      </div>
      <Link to={`/products/${item.product_id}`} className="group-hover:scale-105 transition-transform duration-200">
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <img
            src={`${PRODUCT_ASSET_URL}/${item.image}`}
            alt={item.name}
            className="w-28 h-28 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
      </Link>
      <div className="flex-grow space-y-2">
        <Link to={`/products/${item.product_id}`} className="hover:text-blue-600 transition-colors">
          <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{item.name}</h4>
        </Link>
        
        {/* Display variant details if available */}
        {item.variant_details && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(item.variant_details).map(([key, value]) => (
              <span key={key} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        {/* Display add-ons if available */}
        {item.addOns && item.addOns.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-600">Add-ons:</p>
              <button
                onClick={handleEditAddOns}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                title="Edit add-ons"
              >
                <FaEdit className="text-xs" />
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.addOns.map((addon, index) => (
                <button
                  key={index}
                  onClick={handleEditAddOns}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                  title="Click to edit add-ons"
                >
                  {addon.addon_name}
                  {addon.variant_name && addon.variant_value && (
                    <span className="text-blue-500"> ({addon.variant_name}: {addon.variant_value})</span>
                  )}
                  {addon.quantity > 1 && <span className="text-blue-500"> x{addon.quantity}</span>}
                  <span className="text-blue-700 font-semibold"> +₱{formatPrice(addon.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {item.addOnsPrice > 0 ? (
              <span>
                ₱{formatPrice(item.basePrice)} + ₱{formatPrice(item.addOnsPrice)} each
              </span>
            ) : (
              <span>₱{formatPrice(item.basePrice)} each</span>
            )}
          </p>
          <button 
            onClick={() => onRemove(item.cartItemId)} 
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-semibold hover:bg-red-50 px-3 py-1 rounded-full transition-all duration-200"
          >
            <FaTrash className="text-xs" /> Remove
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
        <button
          onClick={() => onUpdateQuantity(item.cartItemId, Number(item.quantity) - 1)}
          disabled={item.quantity <= 1}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          <FaMinus size={12} />
        </button>
        <span className="font-bold text-xl w-12 text-center text-gray-800">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.cartItemId, Number(item.quantity) + 1)}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm"
        >
          <FaPlus size={12} />
        </button>
      </div>
      <div className="text-right min-w-[120px]">
        <p className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors">
          ₱{formatPrice(item.price * item.quantity)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {item.quantity} × (
          {item.addOnsPrice > 0 ? (
            <span>
              ₱{formatPrice(item.basePrice)} + ₱{formatPrice(item.addOnsPrice)}
            </span>
          ) : (
            <span>₱{formatPrice(item.basePrice)}</span>
          )}
          )
        </p>
      </div>
      
      {/* Edit Add-ons Modal */}
      <EditAddOnsModal
        isOpen={showEditAddOnsModal}
        onClose={() => setShowEditAddOnsModal(false)}
        cartItem={item}
        onUpdateCart={handleUpdateCart}
      />
    </div>
  );
};

export default CartItem;
