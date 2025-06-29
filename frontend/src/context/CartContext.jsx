import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { StoreContext } from './StoreContext'; // Import StoreContext

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useContext(AuthContext);
  const { stores } = useContext(StoreContext); // Use stores from context

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setSelectedItems([]);
    }
  }, [user]);

  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity), 0);
    setTotalItems(itemCount);

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartItemId));

    const newSubtotal = selectedCartItems.reduce((sum, item) => {
        const basePrice = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
        const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
        return sum + finalPrice * item.quantity;
    }, 0);

    setSubtotal(newSubtotal);
    setTotal(newSubtotal);

  }, [cartItems, selectedItems, stores]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
      const fetchedItems = response.data.cart_items || [];
      setCartItems(fetchedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const toggleItemSelection = (cartItemId) => {
    setSelectedItems(prev => 
      prev.includes(cartItemId) 
        ? prev.filter(id => id !== cartItemId) 
        : [...prev, cartItemId]
    );
  };

  const toggleSelectAll = () => {
    const allItemIds = cartItems.map(item => item.cartItemId);
    const areAllSelected = cartItems.length > 0 && allItemIds.every(id => selectedItems.includes(id));

    if (areAllSelected) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(allItemIds); // Select all
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('You must be logged in to add items to the cart.');
      return;
    }
    try {
      await axios.post(`${API_URL}/cart`, { product_id: product.id, quantity }, { withCredentials: true });
      toast.success(`${product.name} added to cart!`);
      fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_URL}/cart/items/${cartItemId}`, { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item from cart.');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    try {
      await axios.put(`${API_URL}/cart/items/${cartItemId}`, { quantity }, { withCredentials: true });
      fetchCart();
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      toast.error('Failed to update item quantity.');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`, { withCredentials: true });
      setCartItems([]);
      setSelectedItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        totalItems,
        subtotal,

        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleItemSelection,
        toggleSelectAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};