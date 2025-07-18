import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { CartContext } from './CartContext';
import { fetchStores } from '../api/storeApi';
import { fetchAllProducts, fetchCategories } from '../api/productApi';


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
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

  const maxPrice = useMemo(() => {
    if (allProducts && allProducts.length > 0) {
      return Math.ceil(Math.max(...allProducts.map(p => p.price)));
    }
    return 1000; // Default max price
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value === '' ? '' : parseFloat(value) }));
  };

  const cartContext = useContext(CartContext);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch categories and stores only once if they haven't been loaded
        if (categories.length === 0) {
          const categoriesRes = await fetchCategories();
          setCategories(categoriesRes);
        }
        if (stores.length === 0) {
          const storesRes = await fetchStores();
          const rawStores = storesRes.data || [];
          const fetchedStores = rawStores.map(store => ({
            id: store.id,
            name: store.name,
            description: store.description,
            logo: store.logo,
            cover_photo: store.cover_photo,
            address: store.address,
            phone_number: store.phone_number,
            delivery_fee: parseFloat(store.delivery_fee) || 0,
            owner: store.owner
          }));
          setStores(fetchedStores);
        }
      } catch (error) {
        console.error('Failed to fetch initial data', error);
        setError('Failed to load initial store data.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Run only once

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
    setAllProducts,
    pagination,
    setPagination,
    loading,
    setLoading,
    error,
    setError,
    favorites,
    toggleFavorite,
    isFavorite,
    ...cartContext,
    addToCart: handleAddToCart,
    categories,
    priceRange,
    handlePriceChange
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
