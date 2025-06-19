import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { CartContext } from './CartContext';
import { fetchStores } from '../api/storeApi';
import { fetchAllProducts } from '../api/productApi';
import { fetchCategories } from '../api';


export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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
    const loadData = async () => {
      setLoading(true);
      let fetchedStores = [];
      try {
        const storesRes = await fetchStores();
        fetchedStores = storesRes.data;
        const [productsRes, categoriesRes] = await Promise.all([
          fetchAllProducts(),
          fetchCategories(),
        ]);
        setAllProducts(productsRes.data);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load store data.');
      } finally {
        const mockStores = [
          { id: 9001, name: 'The Corner Bodega', description: 'Your friendly neighborhood spot for snacks, drinks, and essentials.', location: '123 Market St, Metro City', logo: 'placeholder' },
          { id: 9002, name: 'Sunrise Grocers', description: 'Fresh produce and pantry staples, delivered with a smile.', location: '456 Sunrise Ave, Dawn Valley', logo: 'placeholder' },
          { id: 9003, name: 'Midnight Munchies', description: 'Open 24/7 for all your late-night cravings and needs.', location: '789 Night Owl Rd, Dusk Town', logo: 'placeholder' },
          { id: 9004, name: 'City Center Mart', description: 'The convenient choice for busy city dwellers on the go.', location: '101 Plaza Blvd, Urban Core', logo: 'placeholder' },
          { id: 9005, name: 'The Green Leaf', description: 'Organic, healthy, and sustainable products for a better life.', location: '212 Eco Way, Verdant Village', logo: 'placeholder' },
          { id: 9006, name: 'Quick Stop Shop', description: 'In and out in a flash with everything you need.', location: '333 Speedy St, Rushville', logo: 'placeholder' },
        ];
        setStores([...fetchedStores, ...mockStores]);
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
