import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { StoreContext } from '../context/StoreContext';
import { UIContext } from '../context/UIContext';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CategorySidebar = () => {
  const { categories, allProducts: products } = useContext(StoreContext);
  const { isCategorySidebarOpen, closeCategorySidebar } = useContext(UIContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const dealsParam = queryParams.get('on_deal') === 'true';

  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 10000 }; // Default range if no products
    }
    const prices = products.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
    if (prices.length === 0) {
      return { min: 0, max: 10000 };
    }
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [sliderValues, setSliderValues] = useState([priceRange.min, priceRange.max]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const min = params.get('min_price');
    const max = params.get('max_price');
    
    const newMin = min ? parseInt(min, 10) : priceRange.min;
    const newMax = max ? parseInt(max, 10) : priceRange.max;

    setSliderValues([
      Math.max(priceRange.min, newMin),
      Math.min(priceRange.max, newMax)
    ]);
  }, [location.search, priceRange]);

  const handleCategorySelect = (categoryName) => {
    const params = new URLSearchParams(location.search);
    const existingCategories = params.get('category') ? params.get('category').split(',') : [];
    
    const newCategories = new Set(existingCategories);
    if (newCategories.has(categoryName)) {
      newCategories.delete(categoryName);
    } else {
      newCategories.add(categoryName);
    }
    
    if (newCategories.size > 0) {
      params.set('category', Array.from(newCategories).join(','));
    } else {
      params.delete('category');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleSliderChange = (values) => {
    const params = new URLSearchParams(location.search);
    const [min, max] = values;

    if (min > priceRange.min) {
      params.set('min_price', min);
    } else {
      params.delete('min_price');
    }

    if (max < priceRange.max) {
      params.set('max_price', max);
    } else {
      params.delete('max_price');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleDealsToggle = () => {
    const params = new URLSearchParams(location.search);
    if (!dealsParam) {
      params.set('on_deal', 'true');
    } else {
      params.delete('on_deal');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">Categories</h2>
      </div>
      <nav className="py-4 flex-grow overflow-y-auto">
        <ul className="px-2 space-y-1">
          <li>
            <button
              onClick={() => {
                navigate('/products');
                if (isMobile) closeCategorySidebar();
              }}
              className={`block w-full text-left px-6 py-2 transition-colors text-gray-800 font-semibold rounded-full ${!categoryParam || categoryParam === 'all' ? 'bg-blue-100 text-primary' : 'hover:bg-gray-100'}`}>
              All Products
            </button>
          </li>
          {categories.map(parent => (
            <li key={parent.id}>
              <p className="px-6 py-2 font-bold text-gray-800">{parent.name}</p>
              <ul className="space-y-1">
                {parent.children.map(child => {
                  const isSelected = categoryParam && categoryParam.split(',').includes(child.name);
                  return (
                    <li key={child.id}>
                      <button
                        onClick={() => {
                          handleCategorySelect(child.name);
                          if (isMobile) closeCategorySidebar();
                        }}
                        className={`block w-full text-left pl-10 pr-6 py-2 transition-colors text-gray-600 rounded-full ${isSelected ? 'bg-blue-100 text-primary font-semibold' : 'hover:bg-gray-100'}`}>
                        {child.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
        
        <div className="space-y-6">
          {/* Deals Toggle */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">On Deal</span>
            <button
              onClick={handleDealsToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${dealsParam ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${dealsParam ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Price Range</span>
            </div>
            <div className="px-2">
              <Slider
                range
                min={priceRange.min}
                max={priceRange.max}
                value={sliderValues}
                onChange={setSliderValues}
                onAfterChange={handleSliderChange}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#3b82f6' }]}
                handleStyle={[{ borderColor: '#3b82f6', backgroundColor: 'white', borderWidth: 2 }, { borderColor: '#3b82f6', backgroundColor: 'white', borderWidth: 2 }]}
                railStyle={{ backgroundColor: '#e5e7eb' }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2 font-medium">
              <span>₱{sliderValues[0].toLocaleString()}</span>
              <span>₱{sliderValues[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isCategorySidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCategorySidebar}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 lg:hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Filters & Categories</h2>
                <button onClick={closeCategorySidebar} className="text-gray-500 hover:text-primary">
                  <FaTimes size={20} />
                </button>
              </div>
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Static Sidebar */}
      <div className="hidden lg:block bg-transparent h-full">
        <SidebarContent />
      </div>
    </>
  );
};

export default CategorySidebar;
