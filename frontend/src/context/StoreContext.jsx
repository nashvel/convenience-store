import React, { createContext, useState, useEffect } from 'react';
import mouse from '../assets/products/mouse.png';
import keyboard from '../assets/products/keyboard.png';
import summerdress from '../assets/products/summerdress.png';
import leatherjacket from '../assets/products/leatherjacket.png';
import pillow from '../assets/products/pillow.png';
import candles from '../assets/products/candles.png';
import thegreatgatsby from '../assets/products/thegreatgatsby.png';
import basketball from '../assets/products/basketball.png';
import umbrella from '../assets/products/umbrella.png';

export const StoreContext = createContext();

const mockStores = [
  { id: 'store1', name: 'Gadget Grove', description: 'The best gadgets and electronics.', seller: 'client@store.com' },
  { id: 'store2', name: 'Fashion Forward', description: 'The latest trends in fashion.', seller: 'seller2@example.com' },
  { id: 'store3', name: 'Home Haven', description: 'Everything for your home.', seller: 'seller3@example.com' },
];

const mockProducts = [
  { id: 'p1', name: 'Wireless Mouse', price: 25.99, category: 'Electronics', storeId: 'store1', popularity: 9, discount: 10, image: mouse },
  { id: 'p2', name: 'Bluetooth Keyboard', price: 45.00, category: 'Electronics', storeId: 'store1', popularity: 8, discount: 0, image: keyboard },
  { id: 'p3', name: 'Summer Dress', price: 35.50, category: 'Apparel', storeId: 'store2', popularity: 10, discount: 15, image: summerdress },
  { id: 'p4', name: 'Leather Jacket', price: 150.00, category: 'Apparel', storeId: 'store2', popularity: 7, discount: 0, image: leatherjacket },
  { id: 'p5', name: 'Throw Pillow', price: 15.00, category: 'Home Goods', storeId: 'store3', popularity: 6, discount: 5, image: pillow },
  { id: 'p6', name: 'Scented Candle', price: 12.99, category: 'Home Goods', storeId: 'store3', popularity: 9, discount: 0, image: candles },
  {
    id: 'p7',
    name: 'The Great Gatsby',
    price: 12.99,
    category: 'Books',
    storeId: 'store1',
    popularity: 9,
    discount: 0,
    image: thegreatgatsby,
  },
  {
    id: 'p8',
    name: 'Basketball',
    price: 24.99,
    category: 'Sports',
    storeId: 'store2',
    popularity: 8,
    discount: 0,
    image: basketball,
  },
  {
    id: 'p9',
    name: 'Umbrella',
    price: 29.99,
    category: 'Fashion',
    storeId: 'store2',
    popularity: 9,
    discount: 10,
    image: umbrella,
  }
];

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockStores = [
      {
        id: 'store1',
        name: 'Tech World',
        description: 'Your one-stop shop for all things tech.',
        logo: keyboard,
        location: 'Downtown',
        products: ['p1', 'p7']
      },
      {
        id: 'store2',
        name: 'Fashion Hub',
        description: 'Latest fashion trends at great prices.',
        logo: summerdress,
        location: 'Shopping District',
        products: ['p3', 'p4', 'p9']
      },
      {
        id: 'store3',
        name: 'Home Essentials',
        description: 'Everything you need for your home.',
        logo: pillow,
        location: 'Residential Area',
        products: ['p5', 'p6', 'p9']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      try {
        setStores(mockStores);
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load store data.');
        setLoading(false);
      }
    }, 1000);
  }, []);

  return (
    <StoreContext.Provider value={{ stores, products, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
};
