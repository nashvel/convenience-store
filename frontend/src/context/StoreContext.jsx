import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

const mockStores = [
  { id: 'store1', name: 'Gadget Grove', description: 'The best gadgets and electronics.', seller: 'client@store.com' },
  { id: 'store2', name: 'Fashion Forward', description: 'The latest trends in fashion.', seller: 'seller2@example.com' },
  { id: 'store3', name: 'Home Haven', description: 'Everything for your home.', seller: 'seller3@example.com' },
];

const mockProducts = [
  { id: 'p1', name: 'Wireless Mouse', price: 25.99, category: 'Electronics', storeId: 'store1', popularity: 9, discount: 10, image: '/path/to/mouse.jpg' },
  { id: 'p2', name: 'Bluetooth Keyboard', price: 45.00, category: 'Electronics', storeId: 'store1', popularity: 8, discount: 0, image: '/path/to/keyboard.jpg' },
  { id: 'p3', name: 'Summer Dress', price: 35.50, category: 'Apparel', storeId: 'store2', popularity: 10, discount: 15, image: '/path/to/dress.jpg' },
  { id: 'p4', name: 'Leather Jacket', price: 150.00, category: 'Apparel', storeId: 'store2', popularity: 7, discount: 0, image: '/path/to/jacket.jpg' },
  { id: 'p5', name: 'Throw Pillow', price: 15.00, category: 'Home Goods', storeId: 'store3', popularity: 6, discount: 5, image: '/path/to/pillow.jpg' },
  { id: 'p6', name: 'Scented Candle', price: 12.99, category: 'Home Goods', storeId: 'store3', popularity: 9, discount: 0, image: '/path/to/candle.jpg' },
  {
    id: 'p7',
    name: 'The Great Gatsby',
    price: 12.99,
    category: 'Books',
    storeId: 'store1',
    popularity: 9,
    discount: 0,
    image: 'https://via.placeholder.com/300x300.png?text=The+Great+Gatsby',
  },
  {
    id: 'p8',
    name: 'Basketball',
    price: 24.99,
    category: 'Sports',
    storeId: 'store2',
    popularity: 8,
    discount: 0,
    image: 'https://via.placeholder.com/300x300.png?text=Basketball',
  },
  {
    id: 'p9',
    name: 'Margherita Pizza',
    price: 15.99,
    category: 'Food',
    storeId: 'store3',
    popularity: 9,
    discount: 10,
    image: 'https://via.placeholder.com/300x300.png?text=Pizza',
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
        logo: 'https://via.placeholder.com/150x150.png?text=Tech+World',
        location: 'Downtown',
        products: ['p1', 'p7']
      },
      {
        id: 'store2',
        name: 'Fashion Hub',
        description: 'Latest fashion trends at great prices.',
        logo: 'https://via.placeholder.com/150x150.png?text=Fashion+Hub',
        location: 'Shopping District',
        products: ['p4', 'p8']
      },
      {
        id: 'store3',
        name: 'Home Essentials',
        description: 'Everything you need for your home.',
        logo: 'https://via.placeholder.com/150x150.png?text=Home+Essentials',
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
