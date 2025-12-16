// src/component/Map.jsx
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useAuth } from "../Authorization/AuthContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MdOutlineMyLocation } from "react-icons/md";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ⛳ Your LocationIQ Key
// const LOCATIONIQ_KEY = "AIzaSyDQhTx-hV6s2j1v9YL9ewHJwJpTiFhdj00";
const LOCATIONIQ_KEY = "pk.7895d307bfb8f6331b3a11da8ac5403f";

function Map() {
  const { latitude, setLatitude, longitude, setLongitude } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const markerRef = useRef(null);

  // ⭐ Load initial location
  useEffect(() => {
    setIsLoading(true);

    if (!latitude || !longitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setSelectedLocation([latitude, longitude]);
          reverseGeocode(latitude, longitude);
          setIsLoading(false);
        },
        () => {
          const defaultLocation = [28.6139, 77.2090]; // Delhi
          setLatitude(defaultLocation[0]);
          setLongitude(defaultLocation[1]);
          setSelectedLocation(defaultLocation);
          reverseGeocode(defaultLocation[0], defaultLocation[1]);
          setIsLoading(false);
        }
      );
    } else {
      setSelectedLocation([latitude, longitude]);
      reverseGeocode(latitude, longitude);
      setIsLoading(false);
    }
  }, []);

  // ⭐ Reverse Geocoding (LocationIQ)
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );

      const data = await res.json();
      console.log("address Data", data)
      if (data?.display_name) setAddress(data.display_name);
      else setAddress("Address not available");
    } catch (e) {
      setAddress("Address not available");
    }
  };

  // ⭐ Map Click
  const handleMapClick = (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    setSelectedLocation([lat, lng]);
    setLatitude(lat);
    setLongitude(lng);
    reverseGeocode(lat, lng);
  };

  // ⭐ Marker Drag
  const handleMarkerDragEnd = (e) => {
    const pos = e.target.getLatLng();
    setSelectedLocation([pos.lat, pos.lng]);
    setLatitude(pos.lat);
    setLongitude(pos.lng);
    reverseGeocode(pos.lat, pos.lng);
  };

  // ⭐ Address Search (LocationIQ)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${address}&format=json`
      );

      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setSelectedLocation([lat, lng]);
        setLatitude(lat);
        setLongitude(lng);

        reverseGeocode(lat, lng);

        if (map) map.setView([lat, lng], 16);
      } else {
        setError("Address not found.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ⭐ Use Device Location
  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setSelectedLocation([latitude, longitude]);
        setLatitude(latitude);
        setLongitude(longitude);
        reverseGeocode(latitude, longitude);

        if (map) map.setView([latitude, longitude], 16);
      },
      () => {
        setError("Unable to get current location.");
      }
    );
  };

  function MapEvents() {
    useMapEvents({ click: handleMapClick });
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 justify-center items-center">
        <button
          onClick={handleUseCurrentLocation}
          className="cursor-pointer">
          <MdOutlineMyLocation className="text-2xl text-teal-700" />
        </button>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded"
          placeholder="Search location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded"
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

    

      {error && (
        <div className="text-red-600 mb-3">{error}</div>
      )}

      {/* Map */}
      <MapContainer
        center={selectedLocation}
        zoom={14}
        style={{ height: "450px", width: "100%" }}
        whenCreated={setMap}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapEvents />

        <Marker
          position={selectedLocation}
          draggable={true}
          icon={customIcon}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
          ref={markerRef}
        >
          <Popup>
            <div>
              <strong>Latitude:</strong> {selectedLocation[0]}<br />
              <strong>Longitude:</strong> {selectedLocation[1]}<br />
              <strong>Address:</strong> {address}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
