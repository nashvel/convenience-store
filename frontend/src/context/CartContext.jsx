import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios-config';
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

  

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setSelectedItems([]);
    }
  }, [user]);

  useEffect(() => {
    // Calculate total items
    const itemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    setTotalItems(itemCount);

    // Calculate total value of ALL items in the cart
    const newTotal = cartItems.reduce((sum, item) => {
      const basePrice = Number(item.price) || 0;
      const discount = Number(item.discount) || 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      return sum + finalPrice * item.quantity;
    }, 0);
    setTotal(newTotal);

    // Calculate subtotal value of SELECTED items
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartItemId));
    const newSubtotal = selectedCartItems.reduce((sum, item) => {
      const basePrice = Number(item.price) || 0;
      const discount = Number(item.discount) || 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      return sum + finalPrice * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);

  }, [cartItems, selectedItems]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
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
      await api.post('/cart', { product_id: product.id, quantity });
      toast.success(`${product.name} added to cart!`);
      fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/items/${cartItemId}`);
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
      await api.put(`/cart/items/${cartItemId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      toast.error('Failed to update item quantity.');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
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