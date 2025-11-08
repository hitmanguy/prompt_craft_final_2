import React, { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Location } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Fix for default markers and create custom markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom colored markers
const createColoredIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 2C7.58 2 4 5.58 4 10c0 7.5 8 16 8 16s8-8.5 8-16c0-4.42-3.58-8-8-8z" fill="${color}" stroke="#fff" stroke-width="1"/>
        <circle cx="12" cy="10" r="3" fill="#fff"/>
      </svg>
    `)}`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [24, 36],
    shadowSize: [41, 41],
    iconAnchor: [12, 36],
    shadowAnchor: [12, 41],
    popupAnchor: [0, -36],
  });
};

const lostIcon = createColoredIcon("#ef4444"); // Red for lost items
const foundIcon = createColoredIcon("#22c55e"); // Green for found items

export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  address: string;
  color?: string;
  type?: "lost" | "found";
  category?: string;
}

interface MapViewProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationSelect?: (location: Location) => void;
  showSearch?: boolean;
  editable?: boolean;
  radius?: number;
  radiusCenter?: [number, number];
}

const LocationPicker: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
    },
  });
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  locations = [],
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  height = "h-96",
  onLocationSelect,
  editable = false,
  radius,
  radiusCenter,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      if (editable) {
        setSelectedLocation([lat, lng]);
        if (onLocationSelect) {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          });
        }
      }
    },
    [editable, onLocationSelect]
  );

  return (
    <div className={`${height} w-full overflow-hidden rounded-lg border bg-white`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ 
          height: "100%", 
          width: "100%", 
          minHeight: "300px",
          borderRadius: "8px"
        }}
        className="rounded-lg"
        scrollWheelZoom={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render location markers */}
        {locations.map((location) => {
          const icon =
            location.type === "lost"
              ? lostIcon
              : location.type === "found"
              ? foundIcon
              : undefined;

          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="text-sm max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        location.type === "lost" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {location.type?.toUpperCase() || "ITEM"}
                    </span>
                    {location.category && (
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {location.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{location.title}</h3>
                  <p className="text-xs text-gray-600">{location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show radius if provided */}
        {radius && radiusCenter && (
          <Circle
            center={radiusCenter}
            radius={radius * 1000} // Convert km to meters
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.1,
            }}
          />
        )}

        {/* Selected location marker in edit mode */}
        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {/* Location picker for editable maps */}
        {editable && <LocationPicker onSelect={handleLocationSelect} />}
      </MapContainer>
    </div>
  );
};

export default MapView;
