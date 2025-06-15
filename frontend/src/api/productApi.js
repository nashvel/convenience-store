import axios from 'axios';

// For demo purposes, we'll use mock data
// In a real app, you would connect to a real API

// Mock data for convenience store products
const mockProducts = [
  {
    id: '1',
    name: 'Instant Ramen Cup',
    description: 'Quick and delicious instant noodles in a cup. Just add hot water!',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    inStock: true,
    rating: 4.5,
    featured: true,
  },
  {
    id: '2',
    name: 'Bottled Water (500ml)',
    description: 'Refreshing purified water in a convenient bottle.',
    price: 0.99,
    image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    inStock: true,
    rating: 4.8,
    featured: false,
  },
  {
    id: '3',
    name: 'Potato Chips',
    description: 'Crunchy potato chips with a perfect blend of salt and flavor.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Snacks',
    inStock: true,
    rating: 4.6,
    featured: true,
  },
  {
    id: '4',
    name: 'Energy Drink',
    description: 'Boost your energy levels with this refreshing energy drink.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    inStock: true,
    rating: 4.2,
    featured: false,
  },
  {
    id: '5',
    name: 'Chocolate Bar',
    description: 'Smooth and creamy milk chocolate for a delightful treat.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1621371205896-3fe08dac9d52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Snacks',
    inStock: true,
    rating: 4.7,
    featured: true,
  },
  {
    id: '6',
    name: 'Sandwich',
    description: 'Freshly made sandwich with quality ingredients.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    inStock: true,
    rating: 4.4,
    featured: true,
  },
  {
    id: '7',
    name: 'Coffee (16oz)',
    description: 'Freshly brewed coffee to kickstart your day.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    inStock: true,
    rating: 4.9,
    featured: true,
  },
  {
    id: '8',
    name: 'Ice Cream Bar',
    description: 'Delicious frozen treat for a hot day.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Frozen',
    inStock: true,
    rating: 4.6,
    featured: false,
  },
  {
    id: '9',
    name: 'Fresh Fruit Cup',
    description: 'Assorted fresh fruits cut into bite-sized pieces.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Fresh',
    inStock: true,
    rating: 4.7,
    featured: true,
  },
  {
    id: '10',
    name: 'Protein Bar',
    description: 'Nutritious protein bar for a quick energy boost.',
    price: 2.79,
    image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Snacks',
    inStock: true,
    rating: 4.3,
    featured: false,
  },
  {
    id: '11',
    name: 'Soda Can',
    description: 'Refreshing carbonated beverage in a convenient can.',
    price: 1.29,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    inStock: true,
    rating: 4.5,
    featured: false,
  },
  {
    id: '12',
    name: 'Hand Sanitizer',
    description: 'Keep your hands clean on the go with this portable sanitizer.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Health',
    inStock: true,
    rating: 4.8,
    featured: false,
  },
];

// Mock categories
const mockCategories = [
  { id: '1', name: 'Food', icon: 'utensils' },
  { id: '2', name: 'Beverages', icon: 'coffee' },
  { id: '3', name: 'Snacks', icon: 'cookie' },
  { id: '4', name: 'Frozen', icon: 'snowflake' },
  { id: '5', name: 'Fresh', icon: 'apple-alt' },
  { id: '6', name: 'Health', icon: 'medkit' },
];

// Fetch all products
export const fetchAllProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
};

// Fetch featured products
export const fetchFeaturedProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.filter(product => product.featured);
};

// Fetch product by ID
export const fetchProductById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProducts.filter(p => p.category === category);
};

// Fetch all categories
export const fetchCategories = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
};

// Search products
export const searchProducts = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) || 
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  );
};