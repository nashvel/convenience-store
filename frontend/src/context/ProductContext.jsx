import React, { createContext, useContext, useMemo, useState } from 'react';
import { StoreContext } from './StoreContext';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { products, loading, error } = useContext(StoreContext);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('productFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const categories = useMemo(() => {
    if (products) {
      const categoryNames = [...new Set(products.map(p => p.category))];
      const categoryIconMap = {
        'Electronics': 'tv',
        'Apparel': 'tshirt',
        'Home Goods': 'home',
        'Books': 'book',
        'Sports': 'futbol',
        'Food': 'utensils',
        'Default': 'tag'
      };
      return categoryNames.map((name, index) => ({
        id: index + 1,
        name: name,
        icon: categoryIconMap[name] || categoryIconMap['Default'],
      }));
    }
    return [];
  }, [products]);

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

    const featuredProducts = useMemo(() => {
    if (products) {
      return products.slice(0, 8);
    }
    return [];
  }, [products]);

  const value = useMemo(() => ({ products, featuredProducts, categories, loading, error, favorites, isFavorite, toggleFavorite }), [products, featuredProducts, categories, loading, error, favorites]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};