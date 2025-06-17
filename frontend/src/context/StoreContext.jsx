import React, { createContext, useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { fetchStores } from '../api/storeApi';
import { fetchAllProducts } from '../api/productApi';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartContext = useContext(CartContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [storesRes, productsRes] = await Promise.all([
          fetchStores(),
          fetchAllProducts(),
        ]);
        setStores(storesRes.data);
        setAllProducts(productsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load store data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  const handleAddToCart = (product, quantity) => {
    cartContext.addToCart(product, quantity);
    setAllProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === product.id
          ? { ...p, stock: Number(p.stock) - quantity }
          : p
      )
    );
  };

  const contextValue = {
    stores,
    allProducts,
    loading,
    error,
    favorites,
    toggleFavorite,
    isFavorite,
    ...cartContext,
    addToCart: handleAddToCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
