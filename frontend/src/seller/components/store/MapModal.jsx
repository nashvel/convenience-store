import React, { useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTimes } from 'react-icons/fa';

// Fix for default Leaflet icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], 15);
        }
    }, [position, map]);
    return null;
};

const LocationMarker = ({ position, setPosition }) => {
    const markerRef = useRef(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const newPos = marker.getLatLng();
                setPosition(newPos);
                
            }
        },
    }), [setPosition]);

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
};

const MapModal = ({ isOpen, onClose, position, setPosition, setStoreData }) => {
    const [currentAddress, setCurrentAddress] = React.useState(null);

    useEffect(() => {
        if (position) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.display_name) {
                        setStoreData(prev => ({ ...prev, address: data.display_name, latitude: position.lat, longitude: position.lng }));
                        const address = data.address;
                        const street = address.road || '';
                        const city = address.city || address.town || address.village || '';
                        setCurrentAddress({ street, city });
                    }
                }).catch(err => {
                    console.error("Error fetching address:", err);
                    setCurrentAddress(null);
                });
        }
    }, [position, setStoreData]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-4xl mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Pin Your Location</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                <div style={{ height: '60vh', width: '100%' }}>
                    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapUpdater position={position} />
                        <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>
                <div className="flex justify-between items-center mt-4">
                                                            <div className="text-sm text-gray-600">
                        {currentAddress ? (
                            <p><span className="font-semibold">{currentAddress.street}</span>, {currentAddress.city}</p>
                        ) : (
                            <p>Loading address...</p>
                        )}
                        {position && <p className="text-xs text-gray-400">Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}</p>}
                    </div>
                    <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
