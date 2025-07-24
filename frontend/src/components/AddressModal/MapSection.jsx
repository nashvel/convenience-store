import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { FaSpinner, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const MapSection = ({ 
  showMap, 
  handleLocateMe, 
  isLocating, 
  searchQuery, 
  handleSearchInputChange, 
  isSearching, 
  mapCenter, 
  selectedPosition, 
  handleMapLocationSelect,
  address,
  searchResults,
  handleSuggestionClick
}) => {
  if (!showMap) return null;

  return (
    <div className="mb-6">
        <button
            type="button"
            onClick={handleLocateMe}
            className="w-full flex items-center justify-center px-4 py-3 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLocating}
        >
            {isLocating ? <FaSpinner className="animate-spin mr-2" /> : <FaMapMarkerAlt className="mr-2" />}
            {isLocating ? 'Locating...' : 'Locate Me'}
        </button>
      <div className="relative z-10 mb-4">
        <label className="block text-sm font-semibold text-gray-800 mb-3">Search Address on Map</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Type an address, landmark, or location..."
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:border-gray-300"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          {isSearching && (
            <FaSpinner className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin text-lg" />
          )}
          {searchResults && searchResults.length > 0 && (
            <div className="absolute w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div 
                    key={result.place_id}
                    onClick={() => handleSuggestionClick(result)}
                    className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                      index === 0 ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {result.display_name.split(',').slice(1).join(',').trim()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Click on a suggestion to select location
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative z-0 h-64 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onLocationSelect={handleMapLocationSelect} />
          {selectedPosition && selectedPosition.length >= 2 && (
            <Marker position={selectedPosition}>
              <Popup>
                Selected Location<br />
                Lat: {(typeof selectedPosition[0] === 'number' ? selectedPosition[0] : parseFloat(selectedPosition[0]) || 0).toFixed(6)}<br />
                Lng: {(typeof selectedPosition[1] === 'number' ? selectedPosition[1] : parseFloat(selectedPosition[1]) || 0).toFixed(6)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Click on the map to select your preferred pickup location. 
        {address && (address.latitude != null) && (address.longitude != null) && (
          <span className="text-blue-600">
            Current: {(typeof address.latitude === 'number' ? address.latitude : parseFloat(address.latitude) || 0).toFixed(6)}, {(typeof address.longitude === 'number' ? address.longitude : parseFloat(address.longitude) || 0).toFixed(6)}
          </span>
        )}
      </p>
    </div>
  );
};

export default MapSection;
