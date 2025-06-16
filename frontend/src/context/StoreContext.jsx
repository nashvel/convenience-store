import React, { createContext, useState, useEffect } from 'react';
import techworld from '../assets/products/techworld.png';
import homeessentials from '../assets/products/homeessentials.png';
import fashionhub from '../assets/products/fashionhub.png';
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
  {
    id: 'p1',
    name: 'Wireless Mouse',
    price: 49.99,
    category: 'Electronics',
    storeId: 'store1',
    popularity: 10,
    discount: 0,
    image: mouse,
    stock: 100,
    rating: 4.5
  },
  {
    id: 'p2',
    name: 'Keyboard',
    price: 69.99,
    category: 'Electronics',
    storeId: 'store1',
    popularity: 8,
    discount: 0,
    image: keyboard,
    stock: 50,
    rating: 4.2
  },
  {
    id: 'p3',
    name: 'Summer Dress',
    price: 39.99,
    category: 'Fashion',
    storeId: 'store2',
    popularity: 9,
    discount: 15,
    image: summerdress,
    stock: 30,
    rating: 4.8
  },
  {
    id: 'p4',
    name: 'Leather Jacket',
    price: 149.99,
    category: 'Fashion',
    storeId: 'store2',
    popularity: 7,
    discount: 20,
    image: leatherjacket,
    stock: 20,
    rating: 4.6
  },
  {
    id: 'p5',
    name: 'Pillow',
    price: 19.99,
    category: 'Home',
    storeId: 'store3',
    popularity: 8,
    discount: 0,
    image: pillow,
    stock: 75,
    rating: 4.3
  },
  {
    id: 'p6',
    name: 'Scented Candles',
    price: 24.99,
    category: 'Home',
    storeId: 'store3',
    popularity: 9,
    discount: 10,
    image: candles,
    stock: 45,
    rating: 4.7
  },
  {
    id: 'p7',
    name: 'The Great Gatsby',
    price: 12.99,
    category: 'Books',
    storeId: 'store1',
    popularity: 9,
    discount: 0,
    image: thegreatgatsby,
    stock: 100,
    rating: 4.9
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
    stock: 60,
    rating: 4.1
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
    stock: 50,
    rating: 4.4
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
        logo: techworld,
        location: 'Downtown',
        products: ['p1', 'p7']
      },
      {
        id: 'store2',
        name: 'Fashion Hub',
        description: 'Latest fashion trends at great prices.',
        logo: fashionhub,
        location: 'Shopping District',
        products: ['p3', 'p4', 'p9']
      },
      {
        id: 'store3',
        name: 'Home Essentials',
        description: 'Everything you need for your home.',
        logo: homeessentials,
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
