import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import ReactDOMServer from 'react-dom/server';
import { FaMotorcycle, FaUserCircle, FaUser, FaBoxOpen, FaTimes, FaRoute, FaPlay } from 'react-icons/fa';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapEvents = ({ onInteraction }) => {
  useMapEvents({
    dragstart: () => onInteraction(true),
    zoomstart: () => onInteraction(true),
  });
  return null;
};

const MarkerWithPopup = ({ order, handleGetDirections, onStartDelivery, onCancelDelivery, onOpenCancelModal }) => {
  const map = useMap();

  const lat = order.latitude || order.customer_latitude;
  const lng = order.longitude || order.customer_longitude;

  if (!lat || !lng) {
    return null;
  }

  const position = [lat, lng];

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
          <div className="flex items-center">
            <FaUser className="mr-2 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{order.delivery_full_name}</h3>
          </div>
          <br />
          <small className="text-gray-500"><i>{minutesAgo(order.created_at)}</i></small>
          <hr className="my-2" />
          <div className="flex items-center font-bold text-gray-800 dark:text-gray-100">
            <FaBoxOpen className="mr-2 text-blue-500" />
            <span>Items:</span>
          </div>
          <ul className="pl-5 mt-1 list-disc list-inside text-sm">
            {items.map((item, index) => (
              <li key={index}>{`${item.product_name} (x${item.quantity})`}</li>
            ))}
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between items-center mb-2">
            <b className="text-base">Total:</b>
            <span className="font-bold text-base">₱{parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          
          {order.status === 'accepted' && (
            <button 
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center"
              onClick={() => onStartDelivery(order.id)} >
              <FaPlay className="mr-2" /> Start Delivery
            </button>
          )}
          {order.status === 'in_transit' && (
            <div className="flex flex-col space-y-2">
              <button 
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center" 
                onClick={() => handleGetDirections([order.customer_latitude, order.customer_longitude])} >
                <FaRoute className="mr-2" /> Get Directions
              </button>
              <button 
                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center"
                onClick={() => onOpenCancelModal(order.id)} >
                <FaTimes className="mr-2" /> Cancel Delivery
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

const CancelModal = ({ orderId, onConfirm, onDismiss }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
      <h3 className="text-lg font-bold mb-4">Cancel Delivery</h3>
      <p className="text-gray-600 mb-6">Please select a reason for cancellation for order #{orderId}.</p>
      <div className="space-y-3">
        <button 
          onClick={() => onConfirm('redeliver_later')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <p className="font-semibold">Redeliver Later</p>
          <p className="text-sm text-gray-500">The order will be re-attempted.</p>
        </button>
        <button 
          onClick={() => onConfirm('failed_attempt')}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <p className="font-semibold">Failed Attempt</p>
          <p className="text-sm text-gray-500">The order could not be delivered.</p>
        </button>
      </div>
      <button 
        onClick={onDismiss}
        className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  </div>
);

const Routing = ({ directionsRef, setRoutingDestination }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const watchIdRef = useRef(null);

  const createDivIcon = (iconComponent) => L.divIcon({
    html: ReactDOMServer.renderToString(iconComponent),
    className: 'bg-transparent border-none',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const riderIcon = createDivIcon(<FaUserCircle size={30} color="#2563eb" />);
  const motorIcon = createDivIcon(<FaMotorcycle size={30} color="#16a34a" />);

  // Create the routing control once and store it in a ref
  useEffect(() => {
    if (!map || routingControlRef.current) return;

    routingControlRef.current = L.Routing.control({
      waypoints: [],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 4, opacity: 0.8 }],
      },
      addWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i, wp) => L.marker(wp.latLng, { icon: i === 0 ? motorIcon : riderIcon }),
    }).addTo(map);
  }, [map, motorIcon, riderIcon]);

  // This effect sets up the function that the parent component will call
  useEffect(() => {
    if (!directionsRef) return;

    directionsRef.current = (destination) => {
      if (!routingControlRef.current) return;

      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      setRoutingDestination(destination);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const start = L.latLng(pos.coords.latitude, pos.coords.longitude);
          const end = L.latLng(destination[0], destination[1]);

          routingControlRef.current.setWaypoints([start, end]);
          setRoutingDestination(null);

          watchIdRef.current = navigator.geolocation.watchPosition((newPos) => {
            const newLatLng = L.latLng(newPos.coords.latitude, newPos.coords.longitude);
            const waypoints = routingControlRef.current.getWaypoints();
            if (waypoints.length > 0) {
              routingControlRef.current.spliceWaypoints(0, 1, newLatLng);
            }
          });
        },
        (err) => {
          alert('Could not get your location. Please enable location services.');
          setRoutingDestination(null);
          routingControlRef.current.setWaypoints([]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [directionsRef, setRoutingDestination]);

  return null;
};

const PhilippinesMap = ({ orders, defaultZoom = 5, onStartDelivery, onCancelDelivery, directionsRef }) => {
  const [routingDestination, setRoutingDestination] = useState(null);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const userInteracted = useRef(false);

  const position = [12.8797, 121.7740];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapEvents onInteraction={() => (userInteracted.current = true)} />
        <Routing directionsRef={directionsRef} setRoutingDestination={setRoutingDestination} />
        
        {orders.map(order => (
          <MarkerWithPopup
            key={order.id}
            order={order}
            handleGetDirections={(dest) => directionsRef.current && directionsRef.current(dest)}
            onStartDelivery={onStartDelivery}
            onOpenCancelModal={(orderId) => setCancelModal({ isOpen: true, orderId })}
          />
        ))}

        {cancelModal.isOpen && (
          <CancelModal 
            orderId={cancelModal.orderId}
            onConfirm={(reason) => {
              onCancelDelivery(cancelModal.orderId, reason);
              setCancelModal({ isOpen: false, orderId: null });
            }}
            onDismiss={() => setCancelModal({ isOpen: false, orderId: null })}
          />
        )}
        
        {routingDestination && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
            <div className="bg-white p-4 rounded-lg shadow-xl">
              <p className="text-gray-800">Fetching route...</p>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default PhilippinesMap;
