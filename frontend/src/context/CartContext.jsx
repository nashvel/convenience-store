import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useContext(AuthContext);

  const API_URL = 'http://localhost:8080/api';

  // Fetch cart from DB when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

  // Update totals whenever cart changes
  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);

    const currentSubtotal = cartItems.reduce((sum, item) => {
      const basePrice = Number(item.price) || 0;
      const discount = Number(item.discount) || 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      return sum + finalPrice * item.quantity;
    }, 0);
    setSubtotal(currentSubtotal);

    const currentTax = currentSubtotal * 0.10;
    setTax(currentTax);

    const currentTotal = currentSubtotal + currentTax;
    setTotal(currentTotal);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
      setCartItems(response.data.cart_items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Don't show an error toast on initial load
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
      fetchCart(); // Refresh cart from DB
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_URL}/cart/items/${cartItemId}`, { withCredentials: true });
      fetchCart(); // Refresh cart
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
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      toast.error('Failed to update item quantity.');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`, { withCredentials: true });
      setCartItems([]); // Optimistically clear UI
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};