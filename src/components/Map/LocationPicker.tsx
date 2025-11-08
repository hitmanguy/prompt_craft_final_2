import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { Location } from "@/types";

interface LocationPickerProps {
  onSelect: (location: Location) => void;
  disabled?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onSelect,
  disabled = false,
}) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Using Nominatim (OpenStreetMap) free geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();

      const formattedSuggestions = data.map((item: any) => ({
        id: item.place_id,
        address: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city: item.address?.city || "",
        state: item.address?.state || "",
        country: item.address?.country || "",
        zipCode: item.address?.postcode || "",
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    searchLocations(value);
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setAddress(location.address);
    setSuggestions([]);
    onSelect(location);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const location: Location = {
              latitude,
              longitude,
              address: data.display_name || "Current Location",
              city: data.address?.city || "",
              state: data.address?.state || "",
              country: data.address?.country || "",
              zipCode: data.address?.postcode || "",
            };

            handleSelectLocation(location);
          } catch (error) {
            console.error("Error getting location:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search location or address..."
          value={address}
          onChange={handleAddressChange}
          disabled={disabled}
          className="pl-10"
        />
        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

        {loading && (
          <Loader2 className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 animate-spin" />
        )}

        {suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelectLocation(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 transition-colors"
              >
                <p className="font-medium text-sm">
                  {suggestion.address.split(",")[0]}
                </p>
                <p className="text-xs text-gray-500">{suggestion.address}</p>
              </button>
            ))}
          </Card>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGetCurrentLocation}
        disabled={disabled}
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Use Current Location
      </Button>

      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
          <p className="font-medium text-blue-900">Selected Location</p>
          <p className="text-blue-700">{selectedLocation.address}</p>
          <p className="text-xs text-blue-600 mt-1">
            {selectedLocation.latitude.toFixed(4)},{" "}
            {selectedLocation.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
