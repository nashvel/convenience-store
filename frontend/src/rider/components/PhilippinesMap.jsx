import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import ReactDOMServer from 'react-dom/server';
import { FaMotorcycle, FaUserCircle, FaSpinner } from 'react-icons/fa';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



const MarkerWithZoom = ({ order, onGetDirections, onClearRoute, isRouteActive, routingDestination }) => {
  const map = useMap();

  if (!order.latitude || !order.longitude) {
    return null;
  }

  const position = [order.latitude, order.longitude];
  const isRouting = JSON.stringify(routingDestination) === JSON.stringify(position);

  const handleClick = () => {
    map.flyTo(position, 16);
  };

  const minutesAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now - orderDate;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} mins ago`;
  };

  let items = [];
  if (typeof order.items === 'string') {
    try {
      items = JSON.parse(order.items);
    } catch (e) {
      console.error('Failed to parse order items', e);
    }
  } else if (Array.isArray(order.items)) {
    items = order.items;
  }

  return (
    <Marker position={position} eventHandlers={{ click: handleClick }}>
      <Popup>
        <div className="w-48">
          <b className="text-base">{order.delivery_full_name}</b>
          <br />
          <small className="text-gray-500"><i>{minutesAgo(order.created_at)}</i></small>
          <hr className="my-2" />
          <b>Items:</b>
          <ul className="pl-5 mt-1 list-disc list-inside text-sm">
            {items.map((item, index) => (
              <li key={index}>{item.product_name} (x{item.quantity})</li>
            ))}
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between items-center mb-2">
            <b className="text-base">Total:</b>
            <span className="font-bold text-base">₱{parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          <div className="flex space-x-2">
                        <button 
              onClick={() => onGetDirections(position, map)} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRouting}
            >
              {isRouting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Get Directions'
              )}
            </button>
            {isRouteActive && (
              <button 
                onClick={onClearRoute} 
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Clear Route
              </button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const PhilippinesMap = ({ orders = [], defaultZoom = 13 }) => {
  const [map, setMap] = useState(null);
  const [activeRouteDestination, setActiveRouteDestination] = useState(null);
  const [routingDestination, setRoutingDestination] = useState(null);
  const routingControlRef = useRef(null);
  const watchIdRef = useRef(null);
  const position = [7.9, 125.2]; // Default position

  useEffect(() => {
    if (!map || orders.length === 0) return;

    const locations = orders
      .map(o => (o.latitude && o.longitude ? L.latLng(o.latitude, o.longitude) : null))
      .filter(Boolean);

    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (locations.length === 1) {
      map.setView(locations[0], defaultZoom);
    }
  }, [orders, map, defaultZoom]);

  // Define custom icons using react-icons
  const createDivIcon = (iconComponent) => {
    return L.divIcon({
      html: ReactDOMServer.renderToString(iconComponent),
      className: 'bg-transparent border-none',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const riderIcon = createDivIcon(<FaUserCircle size={30} color="#2563eb" />);
  const motorIcon = createDivIcon(<FaMotorcycle size={30} color="#16a34a" />);

  const handleClearRoute = () => {
    if (map && routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setActiveRouteDestination(null);
  };

  // Cleanup effect to clear route and watch on component unmount
  useEffect(() => {
    return () => {
      handleClearRoute();
    };
  }, []);

  const handleGetDirections = (destination, map) => {
    if (!map) return;

    handleClearRoute(); // Clear any previous route and watch

    const waypoints = [
      null, // Rider's position will be updated in real-time
      L.latLng(destination[0], destination[1])
    ];

    routingControlRef.current = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i, wp, n) => {
        // The rider is the start point (i === 0), so they get the motorcycle icon.
        const icon = i === 0 ? motorIcon : riderIcon;
        return L.marker(wp.latLng, { icon });
      },
    }).addTo(map);

    setActiveRouteDestination(destination);
    setRoutingDestination(destination);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newWaypoints = [
          L.latLng(latitude, longitude),
          L.latLng(destination[0], destination[1])
        ];
        routingControlRef.current.setWaypoints(newWaypoints);
        if (routingDestination) {
          setRoutingDestination(null);
        }
      },
      (err) => {
        console.error('Geolocation watch error:', err);
        alert('Could not track your location. Please ensure location services are enabled.');
        setRoutingDestination(null); // Stop loading on error
        handleClearRoute();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={position} // Use the static default position for initial load
        zoom={7} // Set a sensible default, fitBounds will override this
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {orders.map(order => (
          <MarkerWithZoom
            key={order.id}
            order={order}
            onGetDirections={handleGetDirections}
            onClearRoute={handleClearRoute}
            isRouteActive={JSON.stringify(activeRouteDestination) === JSON.stringify([order.latitude, order.longitude])}
            routingDestination={routingDestination}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default PhilippinesMap;
