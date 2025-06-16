import React, { createContext, useState, useEffect } from 'react';
import { fetchAllProducts, fetchFeaturedProducts, fetchCategories } from '../api/productApi';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories
        const allProducts = await fetchAllProducts();
        const featured = await fetchFeaturedProducts();
        const categoryList = await fetchCategories();
        
        setProducts(allProducts);
        setFeaturedProducts(featured);
        setCategories(categoryList);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('productFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load product data');
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addToFavorites = (product) => {
    const newFavorites = [...favorites, product];
    setFavorites(newFavorites);
    localStorage.setItem('productFavorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (productId) => {
    const newFavorites = favorites.filter(product => product.id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('productFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (productId) => {
    return favorites.some(product => product.id === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        categories,
        favorites,
        loading,
        error,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};