import React, { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../../context/StoreContext';

const categoryImageMap = {
  'Books': '/images/cards/books.png',
  'Electronics': '/images/cards/electronics.png',
  'Fashion': '/images/cards/fashion.png',
  'Foods': '/images/cards/foods.png',
  'Home & Kitchen': '/images/cards/homeandkitchen.png',
  'Sports & Outdoor': '/images/cards/sportsandoutdoor.png',
};

const CategoryNavbar = () => {
  const { categories, loading } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoryParam = queryParams.get('category');
  const dealsParam = queryParams.get('deals');
  const searchParam = queryParams.get('search');
  const minPriceParam = queryParams.get('minPrice');
  const maxPriceParam = queryParams.get('maxPrice');

  const areFiltersActive = useMemo(() => {
    // Only hide if filters other than category are active, so the category bar stays.
    return !!(dealsParam || searchParam || minPriceParam || maxPriceParam);
  }, [dealsParam, searchParam, minPriceParam, maxPriceParam]);

  // Filter out restaurant-specific categories for products page
  const restaurantCategories = ['Pizza', 'Burgers', 'Asian', 'Healthy', 'Desserts', 'Coffee', 'Fast Food', 'Seafood'];
  const mainCategories = useMemo(() => 
    categories.filter(c => !c.parent_id && !restaurantCategories.includes(c.name)), 
    [categories]
  );

  if (areFiltersActive) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3 space-x-6 overflow-x-auto">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
                <div className="mt-2 w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            mainCategories.map(category => {
              const isActive = categoryParam === category.name;
              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                  className="group flex-shrink-0 flex flex-col items-center space-y-1 text-center transition-transform duration-200 ease-in-out hover:-translate-y-1 cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-primary shadow-lg' : 'border-gray-200 group-hover:border-primary group-hover:shadow-lg'}`}
                  >
                    <img
                      src={categoryImageMap[category.name] || '/images/cards/card-01.png'}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>
                    {category.name}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavbar;
