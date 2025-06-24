import React from 'react';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

const StoreLocation = ({ store }) => {
  if (!store) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-sm text-gray-500">Store location not available. Please ensure items are from one store for pickup.</p>
      </div>
    );
  }

  const { name, address, latitude, longitude } = store;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const gmapsEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&amp;output=embed`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Pick-up Location</h3>
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <div>
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaMapMarkerAlt /> {address}
          </p>
        </div>
        
        {latitude && longitude && (
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={gmapsEmbedUrl}
              title={`Map of ${name}`}
            ></iframe>
          </div>
        )}

        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full mt-4 px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-all"
        >
          <FaDirections />
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default StoreLocation;
