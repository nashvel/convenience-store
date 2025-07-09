import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Routing = ({ store, customer }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const waypoints = [
            L.latLng(store.latitude, store.longitude),
            L.latLng(customer.latitude, customer.longitude)
        ];

        const routingControl = L.Routing.control({
            waypoints,
            routeWhileDragging: false,
            show: false, // Hide the turn-by-turn directions
            addWaypoints: false,
            lineOptions: {
                styles: [{ color: '#007bff', opacity: 0.8, weight: 6 }]
            },
            createMarker: () => null // Prevent default markers
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, store, customer]);

    return null;
};

const OrderTrackingMap = ({ order }) => {
    const { store, customer, rider } = order;

    // Determine the center and bounds of the map
    const allPoints = [];
    if (store && store.latitude && store.longitude) {
        allPoints.push(L.latLng(store.latitude, store.longitude));
    }
    if (customer && customer.latitude && customer.longitude) {
        allPoints.push(L.latLng(customer.latitude, customer.longitude));
    }
    if (rider && rider.latitude && rider.longitude) {
        allPoints.push(L.latLng(rider.latitude, rider.longitude));
    }

    const mapCenter = allPoints.length > 0 ? L.latLngBounds(allPoints).getCenter() : [8.48, 124.65]; // Default center if no points
    const zoomLevel = allPoints.length > 0 ? 13 : 8;

    return (
        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Store Marker */}
            {store && store.latitude && store.longitude && (
                <Marker position={[store.latitude, store.longitude]}>
                    <Popup><b>{store.name}</b><br />Store Location</Popup>
                </Marker>
            )}

            {/* Customer Marker */}
            {customer && customer.latitude && customer.longitude && (
                <Marker position={[customer.latitude, customer.longitude]}>
                    <Popup><b>{customer.name}</b><br />Delivery Address</Popup>
                </Marker>
            )}

            {/* Rider Marker */}
            {rider && rider.latitude && rider.longitude && (
                <Marker position={[rider.latitude, rider.longitude]}>
                    <Popup><b>Rider Location</b><br />Last updated: {new Date(rider.timestamp).toLocaleTimeString()}</Popup>
                </Marker>
            )}

            {/* Routing Line */}
            {store && store.latitude && customer && customer.latitude && <Routing store={store} customer={customer} />}
        </MapContainer>
    );
};

export default OrderTrackingMap;
