import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaTimes } from 'react-icons/fa';

const MapModal = ({ order, onClose }) => {
  if (!order) return null;

  // Dummy coordinates for demonstration
  // In a real app, these would come from the order object
  const storeLocation = [14.5547, 121.0244]; // Makati, PH
  const customerLocation = [14.5833, 121.0000]; // Manila, PH

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-3/4 p-4 relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <FaTimes className="text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Route: {order.id}</h2>
        <div className="flex-grow rounded-lg overflow-hidden">
          <MapContainer center={storeLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={storeLocation}>
              <Popup>
                <span className="font-bold">{order.storeName}</span><br />
                {order.storeAddress}
              </Popup>
            </Marker>
            <Marker position={customerLocation}>
              <Popup>
                <span className="font-bold">{order.customerName}</span><br />
                {order.deliveryAddress}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
