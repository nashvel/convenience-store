import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios-config';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useContext(AuthContext);

  

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
      console.log('🛒 Cart items fetched from API:', fetchedItems);
      
      // Ensure price is properly set for each item
      const processedItems = fetchedItems.map(item => {
        console.log('🔍 Processing cart item:', item);
        console.log('🔍 Price fields breakdown:', {
          name: item.name,
          raw_price: item.price,
          variant_price: item.variant_price,
          base_price: item.base_price,
          product_price: item.product_price,
          variant_id: item.variant_id,
          variant_details: item.variant_details
        });
        
        const basePrice = Number(item.price) || Number(item.variant_price) || Number(item.base_price) || Number(item.product_price) || 0;
        
        // Calculate add-ons total price
        const addOnsPrice = (item.addOns || []).reduce((total, addon) => {
          return total + (Number(addon.price) * Number(addon.quantity || 1));
        }, 0);
        
        const finalPrice = basePrice + addOnsPrice;
        
        console.log('💰 Base price:', basePrice, 'Add-ons price:', addOnsPrice, 'Final price:', finalPrice);
        
        return {
          ...item,
          price: finalPrice,
          basePrice: basePrice,
          addOnsPrice: addOnsPrice,
          quantity: Number(item.quantity) || 1,
          variant_details: item.variant_details || null,
          variant_id: item.variant_id || null,
          addOns: item.addOns || []
        };
      });
      
      console.log('✅ Final processed cart items:', processedItems);
      setCartItems(processedItems);
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
      const cartData = { 
        product_id: product.id, 
        quantity 
      };
      
      // Add variant_id if product has a variant selected
      if (product.variant_id) {
        cartData.variant_id = product.variant_id;
      }
      
      // Add add-ons data if available
      if (product.addOns && product.addOns.length > 0) {
        cartData.addOns = product.addOns;
      }
      
      await api.post('/cart', cartData);
      
      // Show success message with add-ons info if applicable
      const addOnsCount = product.addOns ? product.addOns.length : 0;
      const successMessage = addOnsCount > 0 
        ? `${product.name} with ${addOnsCount} add-on${addOnsCount > 1 ? 's' : ''} added to cart!`
        : `${product.name} added to cart!`;
      
      toast.success(successMessage);
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
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};