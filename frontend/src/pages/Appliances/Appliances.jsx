import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLaptop, FaDesktop, FaTabletAlt, FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Appliances = () => {
  const { addToCart } = useContext(StoreContext);
  const [appliances, setAppliances] = useState([]);
  const [filteredAppliances, setFilteredAppliances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState([]);

  // Prototype data for appliances
  const prototypeData = [
    {
      id: 1,
      name: "MacBook Pro 16-inch M3",
      category: "laptop",
      brand: "Apple",
      price: 2499,
      originalPrice: 2699,
      rating: 4.8,
      reviews: 1247,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      specs: ["Apple M3 Pro chip", "16GB RAM", "512GB SSD", "16-inch Retina Display"],
      inStock: true,
      seller: "Apple Store",
      discount: 7
    },
    {
      id: 2,
      name: "Dell XPS 13 Plus",
      category: "laptop",
      brand: "Dell",
      price: 1299,
      originalPrice: 1499,
      rating: 4.6,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      specs: ["Intel Core i7", "16GB RAM", "512GB SSD", "13.4-inch OLED"],
      inStock: true,
      seller: "Dell Official",
      discount: 13
    },
    {
      id: 3,
      name: "Gaming Desktop RTX 4080",
      category: "desktop",
      brand: "Custom Build",
      price: 2199,
      originalPrice: 2399,
      rating: 4.9,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
      specs: ["Intel i7-13700K", "32GB DDR5", "RTX 4080", "1TB NVMe SSD"],
      inStock: true,
      seller: "PC Builder Pro",
      discount: 8
    },
    {
      id: 4,
      name: "iMac 24-inch M3",
      category: "desktop",
      brand: "Apple",
      price: 1699,
      originalPrice: 1799,
      rating: 4.7,
      reviews: 734,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      specs: ["Apple M3 chip", "16GB RAM", "512GB SSD", "24-inch 4.5K Display"],
      inStock: true,
      seller: "Apple Store",
      discount: 6
    },
    {
      id: 5,
      name: "Surface Pro 9",
      category: "tablet",
      brand: "Microsoft",
      price: 999,
      originalPrice: 1199,
      rating: 4.4,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      specs: ["Intel Core i5", "8GB RAM", "256GB SSD", "13-inch PixelSense"],
      inStock: true,
      seller: "Microsoft Store",
      discount: 17
    },
    {
      id: 6,
      name: "ASUS ROG Strix G15",
      category: "laptop",
      brand: "ASUS",
      price: 1599,
      originalPrice: 1799,
      rating: 4.5,
      reviews: 623,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
      specs: ["AMD Ryzen 7", "16GB RAM", "RTX 3070", "15.6-inch 144Hz"],
      inStock: true,
      seller: "ASUS Official",
      discount: 11
    },
    {
      id: 7,
      name: "HP Pavilion Desktop",
      category: "desktop",
      brand: "HP",
      price: 899,
      originalPrice: 999,
      rating: 4.3,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
      specs: ["Intel Core i5", "12GB RAM", "512GB SSD", "Intel UHD Graphics"],
      inStock: true,
      seller: "HP Store",
      discount: 10
    },
    {
      id: 8,
      name: "iPad Pro 12.9-inch",
      category: "tablet",
      brand: "Apple",
      price: 1099,
      originalPrice: 1199,
      rating: 4.8,
      reviews: 891,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      specs: ["Apple M2 chip", "8GB RAM", "256GB Storage", "12.9-inch Liquid Retina"],
      inStock: false,
      seller: "Apple Store",
      discount: 8
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: FaFilter },
    { id: 'laptop', name: 'Laptops', icon: FaLaptop },
    { id: 'desktop', name: 'Desktops', icon: FaDesktop },
    { id: 'tablet', name: 'Tablets', icon: FaTabletAlt }
  ];

  useEffect(() => {
    setAppliances(prototypeData);
    setFilteredAppliances(prototypeData);
  }, []);

  useEffect(() => {
    let filtered = appliances;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(item => 
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredAppliances(filtered);
  }, [appliances, searchTerm, selectedCategory, priceRange, sortBy]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleAddToCart = (appliance) => {
    addToCart({
      id: appliance.id,
      name: appliance.name,
      price: appliance.price,
      image: appliance.image,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Appliances Store
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the latest laptops, desktops, and tablets from top brands
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appliances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      <category.icon className="text-lg" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 5000 }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredAppliances.length} Products Found
              </h2>
              <div className="text-sm text-gray-600">
                Showing results for "{selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name}"
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAppliances.map((appliance) => (
                <motion.div
                  key={appliance.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={appliance.image}
                      alt={appliance.name}
                      className="w-full h-48 object-cover"
                    />
                    {appliance.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{appliance.discount}%
                      </div>
                    )}
                    {!appliance.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(appliance.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        favorites.includes(appliance.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">
                        {appliance.brand}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {appliance.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">{appliance.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({appliance.reviews} reviews)</span>
                    </div>

                    <div className="mb-4">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {appliance.specs.slice(0, 3).map((spec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">${appliance.price}</span>
                        {appliance.originalPrice > appliance.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${appliance.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">by {appliance.seller}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(appliance)}
                        disabled={!appliance.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                          appliance.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart className="text-sm" />
                        Add to Cart
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaEye className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredAppliances.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  <FaLaptop />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appliances;
