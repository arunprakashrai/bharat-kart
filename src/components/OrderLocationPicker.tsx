import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Search, Check, AlertCircle, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { LocationCoordinates } from '../types';

interface OrderLocationPickerProps {
  currentLocation?: LocationCoordinates;
  onLocationSelect: (location: LocationCoordinates, addressDetails?: {
    city?: string;
    state?: string;
    pincode?: string;
    area?: string;
    houseNo?: string;
  }) => void;
  required?: boolean;
}

// Fallback center: New Delhi (Connaught Place / India Gate)
const DEFAULT_CENTER: [number, number] = [28.6139, 77.2090];

export const OrderLocationPicker: React.FC<OrderLocationPickerProps> = ({
  currentLocation,
  onLocationSelect,
  required = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null
  );
  const [addressPreview, setAddressPreview] = useState<string>(
    currentLocation?.displayName || ''
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: Record<string, string>;
  }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Custom stylish pin icon using L.divIcon to avoid any bundler asset issues
  const createCustomPinIcon = () => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; transform: translate(-18px, -36px); cursor: pointer;">
          <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 6px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(2px);"></div>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="none"/>
          </svg>
          <div style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: #22c55e; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px #22c55e;"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  };

  // Reverse geocode lat/lng via free OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const displayName = data.display_name || `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
        setAddressPreview(displayName);

        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.district || '';
        const state = addr.state || '';
        const pincode = addr.postcode || '';
        const area = addr.suburb || addr.neighbourhood || addr.road || addr.quarter || '';
        const houseNo = addr.house_number || '';

        const mapUrl = `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=17/${lat.toFixed(5)}/${lng.toFixed(5)}`;

        const locationObj: LocationCoordinates = {
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          displayName,
          mapUrl,
        };

        onLocationSelect(locationObj, {
          city,
          state,
          pincode,
          area,
          houseNo,
        });
      } else {
        const mapUrl = `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=17/${lat.toFixed(5)}/${lng.toFixed(5)}`;
        const fallbackDisplay = `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
        setAddressPreview(fallbackDisplay);
        onLocationSelect({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          displayName: fallbackDisplay,
          mapUrl,
        });
      }
    } catch {
      const mapUrl = `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=17/${lat.toFixed(5)}/${lng.toFixed(5)}`;
      const fallbackDisplay = `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
      setAddressPreview(fallbackDisplay);
      onLocationSelect({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        displayName: fallbackDisplay,
        mapUrl,
      });
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Update marker position and reverse geocode
  const setPinAt = (lat: number, lng: number, triggerReverse = true) => {
    setSelectedCoords([lat, lng]);

    if (mapInstanceRef.current) {
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], {
          icon: createCustomPinIcon(),
          draggable: true,
        }).addTo(mapInstanceRef.current);

        markerRef.current.on('dragend', (event) => {
          const marker = event.target as L.Marker;
          const pos = marker.getLatLng();
          setPinAt(pos.lat, pos.lng, true);
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      mapInstanceRef.current.panTo([lat, lng]);
    }

    if (triggerReverse) {
      reverseGeocode(lat, lng);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = currentLocation?.latitude || DEFAULT_CENTER[0];
    const initialLng = currentLocation?.longitude || DEFAULT_CENTER[1];
    const initialZoom = currentLocation ? 16 : 13;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Add clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Click handler to move pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      setPinAt(e.latlng.lat, e.latlng.lng, true);
    });

    mapInstanceRef.current = map;

    // Add initial marker if available
    if (currentLocation) {
      markerRef.current = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: createCustomPinIcon(),
        draggable: true,
      }).addTo(map);

      markerRef.current.on('dragend', (event) => {
        const marker = event.target as L.Marker;
        const pos = marker.getLatLng();
        setPinAt(pos.lat, pos.lng, true);
      });
    }

    // Leaflet needs invalidateSize after container renders
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync when currentLocation is cleared or changed externally
  useEffect(() => {
    if (!currentLocation) {
      setSelectedCoords(null);
      setAddressPreview('');
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    } else if (
      !selectedCoords ||
      selectedCoords[0] !== currentLocation.latitude ||
      selectedCoords[1] !== currentLocation.longitude
    ) {
      setSelectedCoords([currentLocation.latitude, currentLocation.longitude]);
      setAddressPreview(currentLocation.displayName || '');
      if (mapInstanceRef.current) {
        if (!markerRef.current) {
          markerRef.current = L.marker([currentLocation.latitude, currentLocation.longitude], {
            icon: createCustomPinIcon(),
            draggable: true,
          }).addTo(mapInstanceRef.current);
          markerRef.current.on('dragend', (event) => {
            const marker = event.target as L.Marker;
            const pos = marker.getLatLng();
            setPinAt(pos.lat, pos.lng, true);
          });
        } else {
          markerRef.current.setLatLng([currentLocation.latitude, currentLocation.longitude]);
        }
      }
    }
  }, [currentLocation]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);
        }
        setPinAt(latitude, longitude, true);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Could not access GPS location. You can click on the map directly to drop your pin.';
        if (err.code === 1) {
          msg = 'Location permission was denied. Please click directly on the map to set your delivery pin.';
        } else if (err.code === 2) {
          msg = 'Location position unavailable. Please click directly on the map to set your delivery pin.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please click on the map to drop your pin.';
        }
        setErrorMessage(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle Address Search
  const handleSearchSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&countrycodes=in&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        setSearchResults(list);
        if (list.length === 0) {
          setErrorMessage('No locations found for this query. Try a different city or locality.');
        }
      }
    } catch {
      setErrorMessage('Search request failed. Please click directly on the map to set location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item: {
    lat: string;
    lon: string;
    display_name: string;
    address?: Record<string, string>;
  }) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lon], 16);
      }
      setPinAt(lat, lon, true);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 p-3 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2874f0] text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-gray-900">
                Delivery Location on Map
              </h4>
              {required && (
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                  Required
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-600">
              Drop pin or click your exact building/doorstep for fast delivery
            </p>
          </div>
        </div>

        {/* Locate Me button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-1.5 bg-[#2874f0] hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          {isLocating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 text-yellow-300" />
              <span>Use Current GPS Location</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input bar */}
      <div className="p-2.5 bg-gray-50 border-b border-gray-200">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              placeholder="Search area, landmark, colony, or city in India..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            disabled={isSearching || !searchQuery.trim()}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Find'}
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-md divide-y divide-gray-100 max-h-44 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left p-2 hover:bg-blue-50 text-xs text-gray-800 flex items-start gap-2 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#2874f0] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map view container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-56 sm:h-64 bg-slate-100 z-0 cursor-crosshair"
          style={{ minHeight: '220px' }}
        />

        {/* Floating Zoom Controls & Map Hint */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-7 h-7 bg-white text-gray-700 hover:bg-gray-100 rounded-md shadow-md flex items-center justify-center transition border border-gray-200"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-7 h-7 bg-white text-gray-700 hover:bg-gray-100 rounded-md shadow-md flex items-center justify-center transition border border-gray-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Instructions overlay badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-sm border border-gray-200 text-[10px] text-gray-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Click anywhere or drag pin to your exact location</span>
        </div>

        {/* Loading overlay for reverse geocoding */}
        {isReverseGeocoding && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-200 text-xs text-gray-700 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Fetching location details...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected location feedback bar */}
      <div className="p-3 bg-white text-xs border-t border-gray-100 space-y-2">
        {selectedCoords ? (
          <div className="flex items-start justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <p className="font-semibold text-emerald-950 text-xs">
                  Location Pinned on Map
                </p>
                <p className="text-[11px] text-emerald-800 line-clamp-2 mt-0.5">
                  {addressPreview || `Coordinates: ${selectedCoords[0].toFixed(5)}, ${selectedCoords[1].toFixed(5)}`}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-700 font-mono">
                  <span>Lat: {selectedCoords[0].toFixed(5)}</span>
                  <span>•</span>
                  <span>Lon: {selectedCoords[1].toFixed(5)}</span>
                </div>
              </div>
            </div>

            <a
              href={`https://www.openstreetmap.org/?mlat=${selectedCoords[0].toFixed(5)}&mlon=${selectedCoords[1].toFixed(5)}#map=17/${selectedCoords[0].toFixed(5)}/${selectedCoords[1].toFixed(5)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#2874f0] hover:underline font-semibold shrink-0"
            >
              View OSM ↗
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Please click on the map or tap &ldquo;Use Current GPS Location&rdquo; to pin your delivery address.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded p-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
