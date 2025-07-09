import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapModal.css';
import { FaTimes } from 'react-icons/fa';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapModal = ({ order, onClose }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // This is the definitive fix for map rendering in modals.
    if (!map || !mapContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    observer.observe(mapContainerRef.current);

    // Force a redraw immediately after the observer is set up.
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, [map]);
  if (!order) return null;

  const customerLocation = [parseFloat(order.latitude), parseFloat(order.longitude)];
  const isValidCoordinates = !customerLocation.some(isNaN);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-3/4 p-4 relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 z-[1001] p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <FaTimes className="text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Location for Order #{order.id}</h2>
                <div ref={mapContainerRef} className="flex-grow rounded-lg overflow-hidden">
          {isValidCoordinates ? (
                        <MapContainer
              center={customerLocation}
              zoom={15}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              ref={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Marker position={customerLocation}>
                <Popup>
                  <span className="font-bold">{order.delivery_full_name}</span><br />
                  {order.line1}, {order.city}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Customer location data is not available for this order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModal;
