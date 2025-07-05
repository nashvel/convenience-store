import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PhilippinesMap = () => {
  const position = [12.8797, 121.7740]; // Center of the Philippines

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Service Area Overview</h2>
      <div className="h-[300px] rounded-lg overflow-hidden">
        <MapContainer center={position} zoom={5.5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default PhilippinesMap;
