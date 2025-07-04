import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { PRODUCT_ASSET_URL } from '../../config';

const CartItem = ({ item, onUpdateQuantity, onRemove, onSelectItem, isSelected }) => {
  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;
    return numericPrice.toFixed(2);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        checked={isSelected}
        onChange={() => onSelectItem(item.cartItemId)}
      />
      <Link to={`/products/${item.product_id}`}>
        <img
          src={`${PRODUCT_ASSET_URL}/${item.image}`}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg shadow-sm"
        />
      </Link>
      <div className="flex-grow">
        <Link to={`/products/${item.product_id}`} className="hover:underline">
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
        </Link>
        <p className="text-sm text-gray-500">Price: ₱{formatPrice(item.price)}</p>
        <button onClick={() => onRemove(item.cartItemId)} className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold">
          <FaTrash /> Remove
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.cartItemId, Number(item.quantity) - 1)}
          disabled={item.quantity <= 1}
          className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaMinus size={12} />
        </button>
        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.cartItemId, Number(item.quantity) + 1)}
          className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all"
        >
          <FaPlus size={12} />
        </button>
      </div>
      <p className="font-semibold w-28 text-right text-gray-800 text-lg">
        ₱{formatPrice(item.price * item.quantity)}
      </p>
    </div>
  );
};

export default CartItem;
