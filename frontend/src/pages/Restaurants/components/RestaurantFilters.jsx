import React from 'react';
import { FaSearch } from 'react-icons/fa';

const FilterSection = ({ title, children }) => (
  <div className="py-6 border-b border-gray-200 px-4">
    <h3 className="font-bold text-blue-800 mb-4 text-sm uppercase tracking-wide">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const RadioOption = ({ id, name, value, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const CheckboxOption = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const RestaurantFilters = ({
  sortBy,
  setSortBy,
  offers = { freeDelivery: false, fastDelivery: false, newRestaurants: false },
  setOffers = () => {},
  ratingFilter,
  setRatingFilter,
  cuisineSearch,
  setCuisineSearch,
  priceRange = { min: 0, max: 1000 },
  setPriceRange = () => {},
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'deliveryTime', label: 'Fastest Delivery' },
    { value: 'distance', label: 'Distance' }, // Note: distance sorting needs data
    { value: 'rating', label: 'Top rated' },
  ];

  const handleOfferChange = (offerKey) => {
    setOffers(prev => ({ ...prev, [offerKey]: !prev[offerKey] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <FilterSection title="Sort by">
        {sortOptions.map(opt => (
          <RadioOption
            key={opt.value}
            id={`sort-${opt.value}`}
            name="sort-by"
            value={opt.value}
            label={opt.label}
            checked={sortBy === opt.value}
            onChange={(e) => setSortBy(e.target.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Quick filters">
        <button 
          onClick={() => setRatingFilter(ratingFilter === 4 ? 0 : 4)}
          className={`w-full text-left px-4 py-2 rounded-lg border-2 transition-colors ${ratingFilter === 4 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-200 hover:bg-blue-50'}`}>
          Ratings 4+
        </button>
      </FilterSection>

      <FilterSection title="Offers">
        <CheckboxOption 
          id="offer-delivery"
          label="Free delivery"
          checked={offers.freeDelivery}
          onChange={() => handleOfferChange('freeDelivery')}
        />
        <CheckboxOption 
          id="offer-fast"
          label="Fast delivery (≤20 min)"
          checked={offers.fastDelivery}
          onChange={() => handleOfferChange('fastDelivery')}
        />
        <CheckboxOption 
          id="offer-new"
          label="New restaurants"
          checked={offers.newRestaurants}
          onChange={() => handleOfferChange('newRestaurants')}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Price: ₱{priceRange.min} - ₱{priceRange.max}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="25"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
              />
              <input
                type="range"
                min="0"
                max="25"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₱0</span>
              <span>₱25+</span>
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Cuisines">
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search for cuisine"
            value={cuisineSearch}
            onChange={(e) => setCuisineSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </FilterSection>
    </div>
  );
};

export default RestaurantFilters;
