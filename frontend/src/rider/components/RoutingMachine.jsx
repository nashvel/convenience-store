import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    // Check for valid coordinates
    if (start.some(isNaN) || end.some(isNaN)) {
        console.error("Invalid coordinates for routing:", { start, end });
        return;
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: false,
      show: false, // Hide the turn-by-turn instructions panel
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#007bff', opacity: 0.8, weight: 6 }]
      },
      createMarker: function() { return null; } // Use our own markers
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

export default RoutingMachine;
