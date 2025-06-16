import axios from 'axios';


const mockProducts = [
  {
    id: '1',
    name: 'Instant Ramen Cup',
    description: 'Quick and delicious instant noodles in a cup. Just add hot water!',
    price: 99.50,
    image: 'https://c8.alamy.com/comp/KWG512/kuala-lumpur-malaysia-december-22-2017-instant-noodle-cups-from-maggi-KWG512.jpg',
    category: 'Food',
    inStock: true,
    rating: 4.5,
    featured: true,
  },
  {
    id: '2',
    name: 'Bottled Water (500ml)',
    description: 'Refreshing purified water in a convenient bottle.',
    price: 49.50,
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
    price: 124.50,
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
    price: 149.50,
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
    price: 74.50,
    image: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_center,w_730,h_487/k/archive/792ab073b37f2333c64d2a92c0d719e827308989',
    category: 'Snacks',
    inStock: true,
    rating: 4.7,
    featured: true,
  },
  {
    id: '6',
    name: 'Meat',
    description: 'Fresh meat for your meal.',
    price: 380.50,
    image: 'https://th.bing.com/th/id/OIP.91w5gc5bvHDWH3iG6_wpQAHaFj?r=0&w=960&h=720&rs=1&pid=ImgDetMain&cb=idpwebpc1',
    category: 'Food',
    inStock: true,
    rating: 4.4,
    featured: true,
  },
  {
    id: '7',
    name: 'Coffee (16oz)',
    description: 'Freshly brewed coffee to kickstart your day.',
    price: 124.50,
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
    price: 99.50,
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
    price: 174.50,
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
    price: 139.50,
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
    price: 64.50,
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
    price: 199.50,
    image: 'https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Health',
    inStock: true,
    rating: 4.8,
    featured: false,
  },
];

const mockCategories = [
  { id: '1', name: 'Food', icon: 'utensils' },
  { id: '2', name: 'Beverages', icon: 'coffee' },
  { id: '3', name: 'Snacks', icon: 'cookie' },
  { id: '4', name: 'Frozen', icon: 'snowflake' },
  { id: '5', name: 'Fresh', icon: 'apple-alt' },
  { id: '6', name: 'Health', icon: 'medkit' },
];

export const fetchAllProducts = async () => {

  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
};

export const fetchFeaturedProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.filter(product => product.featured);
};

export const fetchProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const fetchProductsByCategory = async (category) => {

  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProducts.filter(p => p.category === category);
};

export const fetchCategories = async () => {

  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
};

export const searchProducts = async (query) => {

  await new Promise(resolve => setTimeout(resolve, 400));
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) || 
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const addProduct = async (productData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newProduct = {
    ...productData,
    id: (mockProducts.length + 1).toString(), // Simple ID generation
    inStock: true,
    rating: 0, // New products start with no rating
    featured: false,
  };
  mockProducts.push(newProduct);
  return newProduct;
};

export const mockReviews = [
  {
    id: 1, productId: '1', customerName: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john',
    rating: 5, comment: 'Absolutely love this ramen! The design is so unique and feels great to hold. Highly recommend!', date: '2025-06-15',
  },
  {
    id: 2, productId: '2', customerName: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane',
    rating: 4, comment: 'Great water, looks fantastic on my desk. The lighting is a bit dimmer than I expected, but overall a great purchase.', date: '2025-06-14',
  },
  {
    id: 3, productId: '3', customerName: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?u=sam',
    rating: 5, comment: 'Perfect chips for my living room. It\'s silent and looks very modern. Exactly what I was looking for.', date: '2025-06-12',
  },
  {
    id: 4, productId: '4', customerName: 'Emily Brown', avatar: 'https://i.pravatar.cc/150?u=emily',
    rating: 3, comment: 'The energy drink looks nice, but the installation was a nightmare. The instructions were not clear at all.', date: '2025-06-10',
  },
  {
    id: 5, productId: '1', customerName: 'Chris Green', avatar: 'https://i.pravatar.cc/150?u=chris',
    rating: 4, comment: 'Pretty good, but a bit too spicy for my taste.', date: '2025-06-11',
  },
];

export const fetchAllReviews = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const reviewsWithProduct = mockReviews.map(review => {
    const product = mockProducts.find(p => p.id === review.productId);
    return { ...review, productName: product ? product.name : 'Unknown Product' };
  });
  return reviewsWithProduct;
};

export const fetchReviewsByProductId = async (productId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = mockProducts.find(p => p.id === productId);
  const reviews = mockReviews.filter(r => r.productId === productId);
  return { 
    productName: product ? product.name : 'Unknown Product',
    reviews
  };
};