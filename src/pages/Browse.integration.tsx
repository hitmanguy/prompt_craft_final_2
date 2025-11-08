import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemType, ItemCategory } from "@/types";
import { MapView } from "@/components/Map/MapView";
import { CategoryFilter } from "@/components/Category/CategoryComponents";
import { MaskedContactDisplay } from "@/components/Contact/ContactInfo";
import { StatusBadge } from "@/components/Status/StatusComponents";
import { ShareButton } from "@/components/Share/ShareCard";
import { ReportButton } from "@/components/Report/ReportButton";
import { MapPin, Search } from "lucide-react";

interface BrowseItemType {
  id: string;
  title: string;
  category: ItemCategory;
  status: string;
  itemType: ItemType;
  latitude: number;
  longitude: number;
  address: string;
  userPhone: string;
  userEmail: string;
  thumbnail: string;
  timeAgo: string;
}

export const BrowseIntegration: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [itemType, setItemType] = useState<ItemType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [radius, setRadius] = useState(5);

  // Mock data - replace with actual Supabase queries
  const mockItems: BrowseItemType[] = [
    {
      id: "1",
      title: "Black iPhone 14 Pro",
      category: "phone",
      status: "active",
      itemType: "lost",
      latitude: 20.5937,
      longitude: 78.9629,
      address: "IITK Campus, Kanpur",
      userPhone: "+919876543210",
      userEmail: "user@example.com",
      thumbnail: "https://via.placeholder.com/300x300",
      timeAgo: "2 hours ago",
    },
  ];

  const mapLocations = mockItems.map((item) => ({
    id: item.id,
    lat: item.latitude,
    lng: item.longitude,
    title: item.title,
    address: item.address,
    color: item.itemType === "lost" ? "red" : "green",
  }));

  const handleLocationSelect = (location: any) => {
    // TODO: Filter items by location
    console.log("Selected location:", location);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Browse Items</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for lost or found items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <Card className="p-4 space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2">Category</p>
            <CategoryFilter
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Item Type</p>
            <div className="flex gap-2">
              {(["all", "lost", "found"] as const).map((type) => (
                <Button
                  key={type}
                  variant={itemType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setItemType(type)}
                >
                  {type === "all"
                    ? "All Items"
                    : type === "lost"
                    ? "Lost"
                    : "Found"}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Search Radius</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium">{radius} km</span>
            </div>
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <Tabs
        value={viewMode}
        onValueChange={(val) => setViewMode(val as "grid" | "map")}
      >
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg flex-1">
                      {item.title}
                    </h3>
                    <StatusBadge status={item.status as any} size="sm" />
                  </div>

                  {/* Category & Type */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        item.itemType === "lost"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.itemType === "lost" ? "🔴 Lost" : "🟢 Found"}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{item.address}</span>
                  </div>

                  {/* Contact (Masked) */}
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <p className="text-gray-600 mb-1">Contact:</p>
                    <MaskedContactDisplay
                      phone={item.userPhone}
                      email={item.userEmail}
                    />
                  </div>

                  {/* Time & Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      {item.timeAgo}
                    </span>
                    <div className="flex gap-1">
                      <ShareButton
                        itemId={item.id}
                        itemTitle={item.title}
                        icon
                      />
                      <ReportButton itemId={item.id} />
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <MapView
            locations={mapLocations}
            center={[20.5937, 78.9629]}
            zoom={5}
            height="h-screen"
            radius={radius}
            radiusCenter={[20.5937, 78.9629]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowseIntegration;
