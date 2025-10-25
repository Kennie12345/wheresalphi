"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PlacesMapProps {
  className?: string;
}

export function PlacesMap({ className }: PlacesMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a general location (e.g., San Francisco)
          setPosition([37.7749, -122.4194]);
          setLoading(false);
        }
      );
    } else {
      // Default location if geolocation is not available
      setPosition([37.7749, -122.4194]);
      setLoading(false);
    }
  }, []);

  if (loading || !position) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full rounded-lg"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>Your current location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
