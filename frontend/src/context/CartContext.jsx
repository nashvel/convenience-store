import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Sanitize prices on load to prevent NaN issues
      const sanitizedCart = parsedCart.map(item => {
        const price = typeof item.price === 'string'
          ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
          : item.price;
        return { ...item, price: isNaN(price) ? 0 : price };
      });
      setCartItems(sanitizedCart);
    }
  }, []);
  
  // Update totals whenever cart changes
  useEffect(() => {
    // Calculate total items
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    // Calculate subtotal, applying discounts
    const currentSubtotal = cartItems.reduce((sum, item) => {
      const basePrice = Number(item.price) || 0;
      const discount = Number(item.discount) || 0;
      const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      return sum + finalPrice * item.quantity;
    }, 0);
    setSubtotal(currentSubtotal);

    // Calculate tax (10%)
    const currentTax = currentSubtotal * 0.10;
    setTax(currentTax);

    // Calculate total
    const currentTotal = currentSubtotal + currentTax;
    setTotal(currentTotal);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("addToCart called with invalid product", product);
      return;
    }

    const price = typeof product.price === 'string'
      ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
      : product.price;

    if (isNaN(price)) {
      console.error("Product has an invalid price", product);
      toast.error("Could not add item due to invalid price.");
      return;
    }

    const productToAdd = { ...product, price };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item doesn't exist, add it to the cart
        return [...prevItems, { ...productToAdd, quantity }];
      }
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
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
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};