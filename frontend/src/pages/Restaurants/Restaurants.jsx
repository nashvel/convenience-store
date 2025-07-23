import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';
import api from '../../api/axios-config';
import { PRODUCT_ASSET_URL } from '../../config';

import RestaurantHero from './components/RestaurantHero';
import RestaurantFilters from './components/RestaurantFilters';
import RestaurantCard from './components/RestaurantCard';
import RestaurantMenuModal from './components/RestaurantMenuModal';
import RestaurantCardSkeleton from './components/RestaurantCardSkeleton';
import DiscoverFood from './components/DiscoverFood';
import FavoriteCuisines from './components/FavoriteCuisines';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RestaurantsPage = () => {
  const { stores, loading, error, addToCart } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [offers, setOffers] = useState({ freeDelivery: false, fastDelivery: false, newRestaurants: false });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  // Menu modal states
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [restaurantProducts, setRestaurantProducts] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('restaurantFavorites');
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('restaurantFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const foodCategories = [
    { name: 'All', emoji: '🍽️' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Asian', emoji: '🍜' },
    { name: 'Healthy', emoji: '🥗' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Coffee', emoji: '☕' },
    { name: 'Fast Food', emoji: '🌭' },
    { name: 'Seafood', emoji: '🦐' }
  ];

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      const foundCategory = foodCategories.find(c => c.name.toLowerCase() === category.toLowerCase());
      if (foundCategory) {
        setSelectedCategory(foundCategory.name);
      }
    }
  }, [location.search]);

  // Helper function to determine cuisine from store name
  const getCuisineFromStoreName = (name) => {
    const cuisineMap = {
      'Pizza Palace': 'Italian',
      'Burger Junction': 'American',
      'Asian Fusion': 'Asian',
      'Healthy Bites': 'Healthy',
      'Sweet Treats': 'Desserts',
      'Coffee Corner': 'Coffee',
      'Quick Bites': 'Fast Food',
      'Ocean Delights': 'Seafood'
    };
    return cuisineMap[name] || 'Variety of dishes';
  };

  const restaurants = useMemo(() => {
    return stores.filter(store => store.store_type === 'restaurant').map(store => ({
      ...store,
      // Add missing properties with default values
      isOpen: true, // Default to open
      rating: 4.2 + Math.random() * 0.8, // Random rating between 4.2-5.0
      deliveryTime: Math.floor(Math.random() * 20) + 15, // Random delivery time 15-35 min
      deliveryFee: Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 50) + 20, // 70% free delivery, 30% ₱20-70
      cuisine: store.cuisine || getCuisineFromStoreName(store.name)
    }));
  }, [stores]);

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Category filter from cuisine list - improved to match database categories
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => {
        if (!r.cuisine) return false;
        
        // Direct cuisine match
        if (r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return true;
        }
        
        // Category-specific mappings based on database categories
        const categoryMappings = {
          'Pizza': ['Italian'],
          'Burgers': ['American'],
          'Asian': ['Asian', 'Chinese', 'Japanese', 'Thai', 'Korean'],
          'Healthy': ['Healthy'],
          'Desserts': ['Desserts'],
          'Coffee': ['Coffee'],
          'Fast Food': ['Fast Food', 'American'],
          'Seafood': ['Seafood']
        };
        
        const allowedCuisines = categoryMappings[selectedCategory] || [];
        return allowedCuisines.some(cuisine => 
          r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
        );
      });
    }

    // Main search bar
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sidebar filters based on actual database data
    if (offers.freeDelivery) {
      filtered = filtered.filter(r => r.deliveryFee === 0);
    }
    if (offers.fastDelivery) {
      filtered = filtered.filter(r => r.deliveryTime <= 20); // Fast delivery under 20 min
    }
    if (offers.newRestaurants) {
      filtered = filtered.filter(r => r.isNew || new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // New in last 30 days
    }

    // Sidebar rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(r => r.rating >= ratingFilter);
    }

    // Price range filter (based on average menu prices)
    if (priceRange.min > 0 || priceRange.max < 1000) {
      filtered = filtered.filter(r => {
        // Estimate average price based on cuisine type
        const avgPrices = {
          'Italian': 16, 'American': 12, 'Asian': 14, 'Healthy': 10,
          'Desserts': 5, 'Coffee': 4, 'Fast Food': 7, 'Seafood': 18
        };
        const avgPrice = avgPrices[r.cuisine] || 12;
        return avgPrice >= priceRange.min && avgPrice <= priceRange.max;
      });
    }

    // Sidebar cuisine search
    if (cuisineSearch) {
        filtered = filtered.filter(r => 
            r.cuisine && r.cuisine.toLowerCase().includes(cuisineSearch.toLowerCase())
        );
    }

    // Sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'deliveryTime': return (a.deliveryTime || 999) - (b.deliveryTime || 999);
        case 'name': return a.name.localeCompare(b.name);
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'relevance': // Placeholder for relevance logic
        default: return 0;
      }
    });
  }, [restaurants, selectedCategory, searchQuery, sortBy, offers, ratingFilter, cuisineSearch]);

  // Fetch all food items from all restaurants
  const fetchAllFoodItems = async () => {
    setFoodLoading(true);
    try {
      // First try to get all products and filter them manually
      const response = await api.get('/products');
      console.log('All products response:', response.data);
      
      if (response.data.products && Array.isArray(response.data.products)) {
        // Get restaurant store IDs
        const restaurantIds = restaurants.map(r => r.id);
        console.log('Restaurant IDs:', restaurantIds);
        
        // Filter products that belong to restaurants
        const restaurantProducts = response.data.products.filter(product => {
          console.log('Product store_id:', product.store_id, 'Is restaurant:', restaurantIds.includes(product.store_id));
          return restaurantIds.includes(product.store_id);
        });
        
        console.log('Filtered restaurant products:', restaurantProducts);
        
        const allFoods = restaurantProducts.map(product => {
          // Find the restaurant that owns this product
          const restaurant = restaurants.find(r => r.id === product.store_id);
          return {
            ...product,
            restaurantName: restaurant ? restaurant.name : 'Unknown Restaurant',
            restaurantId: product.store_id,
            restaurantLogo: restaurant ? restaurant.logo : null
          };
        });
        
        // Shuffle the array to randomize the order
        const shuffledFoods = allFoods.sort(() => Math.random() - 0.5);
        console.log('Final shuffled foods:', shuffledFoods);
        setAllFoodItems(shuffledFoods);
      } else {
        console.log('No products found in response. Response structure:', response.data);
        setAllFoodItems([]);
      }
    } catch (error) {
      console.error('Error fetching all food items:', error);
      setAllFoodItems([]);
    } finally {
      setFoodLoading(false);
    }
  };

  // Fetch all food items when restaurants are loaded
  useEffect(() => {
    if (restaurants.length > 0) {
      fetchAllFoodItems();
    }
  }, [restaurants]);

  // Filter food items based on selected category
  const filteredFoodItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return allFoodItems;
    }

    return allFoodItems.filter(food => {
      // Find the restaurant that owns this food item
      const restaurant = restaurants.find(r => r.id === food.store_id);
      if (!restaurant || !restaurant.cuisine) return false;

      // Use the same category mapping logic as restaurant filtering
      const categoryMappings = {
        'Pizza': ['Italian'],
        'Burgers': ['American'],
        'Asian': ['Asian', 'Chinese', 'Japanese', 'Thai', 'Korean'],
        'Healthy': ['Healthy'],
        'Desserts': ['Desserts'],
        'Coffee': ['Coffee'],
        'Fast Food': ['Fast Food', 'American'],
        'Seafood': ['Seafood']
      };

      // Direct cuisine match
      if (restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return true;
      }

      // Category-specific mappings
      const allowedCuisines = categoryMappings[selectedCategory] || [];
      return allowedCuisines.some(cuisine => 
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    });
  }, [allFoodItems, selectedCategory, restaurants]);

  const fetchRestaurantProducts = async (restaurantId) => {
    setMenuLoading(true);
    setMenuError(null);
    try {
      const response = await api.get(`/products?store_id=${restaurantId}&store_type=restaurant`);
      setRestaurantProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching restaurant products:', error);
      setMenuError('Failed to load menu. Please try again.');
      setRestaurantProducts([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleViewMenu = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMenuModal(true);
    fetchRestaurantProducts(restaurant.id);
  };

  const handleCloseMenu = () => {
    setShowMenuModal(false);
    setSelectedRestaurant(null);
    setRestaurantProducts([]);
    setMenuError(null);
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
  };

  const toggleFavorite = (restaurantId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(restaurantId)) {
      newFavorites.delete(restaurantId);
    } else {
      newFavorites.add(restaurantId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- Filters Sidebar --- */}
          <div className="lg:col-span-1 sticky top-12 self-start">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <RestaurantFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              offers={offers}
              setOffers={setOffers}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              cuisineSearch={cuisineSearch}
              setCuisineSearch={setCuisineSearch}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* --- Main Content --- */}
          <main className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-8">
              <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, and dishes"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Favorite Cuisines */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your favorite cuisines</h2>
              <FavoriteCuisines 
                categories={foodCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Restaurant List */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory !== 'All' ? `${selectedCategory}` : 'All'}
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCarouselIndex(prev => Math.max(0, prev - 3))}
                    disabled={carouselIndex === 0}
                    className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={() => setCarouselIndex(prev => prev + 3)}
                    disabled={carouselIndex + 3 >= filteredRestaurants.length}
                    className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => <RestaurantCardSkeleton key={index} />)}
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredRestaurants.slice(carouselIndex, carouselIndex + 3).map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onViewMenu={handleViewMenu}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(restaurant.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No restaurants found matching your criteria.</p>
                </div>
              )}
            </section>

            <DiscoverFood 
              foodItems={filteredFoodItems}
              loading={foodLoading}
              restaurants={restaurants}
              handleViewMenu={handleViewMenu}
              handleAddToCart={handleAddToCart}
            />
          </main>
        </div>
      </div>

      <RestaurantMenuModal
        isOpen={showMenuModal}
        onClose={handleCloseMenu}
        restaurant={selectedRestaurant}
        products={restaurantProducts}
        loading={menuLoading}
        error={menuError}
        onAddToCart={handleAddToCart}
        onRetry={fetchRestaurantProducts}
      />
    </div>
  );
};

export default RestaurantsPage;
