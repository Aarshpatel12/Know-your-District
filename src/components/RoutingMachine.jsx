/**
 * RouteLine — draws a dashed straight line between the user and the selected location.
 *
 * Replaces leaflet-routing-machine entirely to avoid the persistent
 * "Cannot read properties of null (reading 'removeLayer')" crash that occurs
 * when the LRM library tries to clean up after the Leaflet map is gone.
 *
 * A straight polyline is reliable, instant, works offline, and requires no
 * external routing server (OSRM).
 */
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

export default function RoutingMachine({ start, end }) {
  const map = useMap();
  const lineRef = useRef(null);

  useEffect(() => {
    if (!start || !end || !map) return;

    // Remove previous line if it exists
    if (lineRef.current) {
      try {
        map.removeLayer(lineRef.current);
      } catch (_) { /* map may have been torn down */ }
      lineRef.current = null;
    }

    // Draw a dashed polyline from user → destination
    try {
      const line = L.polyline(
        [start, end],
        {
          color: '#2563EB',
          weight: 3,
          opacity: 0.8,
          dashArray: '8, 8',
        }
      ).addTo(map);

      lineRef.current = line;
    } catch (err) {
      console.warn('RouteLine draw error:', err);
    }

    // Cleanup: remove line when component unmounts or coords change
    return () => {
      if (lineRef.current) {
        try {
          map.removeLayer(lineRef.current);
        } catch (_) { /* ignore — map may already be gone */ }
        lineRef.current = null;
      }
    };
  }, [start?.[0], start?.[1], end?.[0], end?.[1]]);

  return null;
}