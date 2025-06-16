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



  const isFavorite = (productId) => {
    return favorites.some(p => String(p.id) === String(productId));
  };

  const toggleFavorite = (productId) => {
    const favoriteExists = favorites.some(p => String(p.id) === String(productId));
    let newFavorites;

    if (favoriteExists) {
      newFavorites = favorites.filter(p => String(p.id) !== String(productId));
    } else {
      const productToAdd = products.find(p => String(p.id) === String(productId));
      if (productToAdd) {
        newFavorites = [...favorites, productToAdd];
      } else {
        newFavorites = favorites; // No change if product not found
      }
    }
    setFavorites(newFavorites);
    localStorage.setItem('productFavorites', JSON.stringify(newFavorites));
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
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};