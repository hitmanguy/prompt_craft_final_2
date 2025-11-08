import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import {
  Search,
  Map,
  Grid,
  List,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import Fuse from "fuse.js";

// Import new advanced components
import { MapView, type MapLocation } from "@/components/Map/MapView";
import { CategoryFilter } from "@/components/Category/CategoryComponents";
import { ContactInfo } from "@/components/Contact/ContactInfo";
import { ShareCard } from "@/components/Share/ShareCard";
import type { ReUniteItem, ItemCategory } from "@/types";
import { dummyItems, DummyItem } from "@/data/dummyItems";

interface Item {
  id: string;
  type: "lost" | "found";
  item_name: string;
  description: string;
  category: string;
  location_city: string;
  location_country: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  item_date: string;
  image_url?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email: string;
  status: string;
  created_at: string;
}

const Browse = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "lost" | "found">(
    "all"
  );
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [fuzzySearch, setFuzzySearch] = useState<Fuse<Item> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Initialize fuzzy search
    if (items.length > 0) {
      const fuse = new Fuse(items, {
        keys: [
          { name: "item_name", weight: 0.4 },
          { name: "description", weight: 0.3 },
          { name: "category", weight: 0.2 },
          { name: "location_city", weight: 0.1 },
        ],
        threshold: 0.3,
        includeScore: true,
      });
      setFuzzySearch(fuse);
    }
  }, [items]);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedType, selectedCategories, fuzzySearch]);

  const fetchItems = async () => {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Database not available, using dummy data:", error.message);
        // Use dummy data if database is not available
        setItems(dummyItems as Item[]);
      } else {
        setItems((data as Item[]) || []);
      }
    } catch (error) {
      console.error("Error fetching items, using dummy data:", error);
      // Use dummy data as fallback
      setItems(dummyItems as Item[]);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category as ItemCategory)
      );
    }

    // Search filter with fuzzy search
    if (searchQuery && fuzzySearch) {
      const searchResults = fuzzySearch.search(searchQuery);
      const matchingIds = new Set(
        searchResults.map((result) => result.item.id)
      );
      filtered = filtered.filter((item) => matchingIds.has(item.id));
    }

    setFilteredItems(filtered);
  };

  const saveCurrentFilter = () => {
    const filterName = `${selectedType}-${selectedCategories.join(
      ","
    )}-${searchQuery}`;
    if (!savedFilters.includes(filterName)) {
      setSavedFilters([...savedFilters, filterName]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedCategories([]);
  };

  const getMapPoints = (): MapLocation[] => {
    return filteredItems
      .filter((item) => item.latitude && item.longitude)
      .map((item) => ({
        id: item.id,
        lat: item.latitude!,
        lng: item.longitude!,
        title: item.item_name,
        address: `${item.location_address || item.location_city}, ${
          item.location_country
        }`,
        color: item.type === "found" ? "#10B981" : "#EF4444", // green for found, red for lost
        type: item.type,
        category: item.category,
      }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Browse Items</h1>
              <p className="text-muted-foreground">
                Search through lost and found items with smart matching •{" "}
                {filteredItems.length} items found
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as any)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <Grid className="w-4 h-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="w-4 h-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-1">
                    <Map className="w-4 h-4" />
                    Map
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Smart search: try 'blue backpack', 'iPhone lost campus', 'keys near library'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-base"
              />
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  Fuzzy Match
                </Badge>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Tabs
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as any)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({items.length})</TabsTrigger>
                  <TabsTrigger value="found">
                    Found ({items.filter((i) => i.type === "found").length})
                  </TabsTrigger>
                  <TabsTrigger value="lost">
                    Lost ({items.filter((i) => i.type === "lost").length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>

              {(searchQuery ||
                selectedType !== "all" ||
                selectedCategories.length > 0) && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear all
                </Button>
              )}

              <Button variant="outline" onClick={saveCurrentFilter} size="sm">
                Save Filter
              </Button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-card p-4 rounded-lg border space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <CategoryFilter
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>

                {savedFilters.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Saved Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedFilters.map((filter, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => {
                            const [type, categories, search] =
                              filter.split("-");
                            setSelectedType(type as any);
                            setSelectedCategories(
                              categories
                                ? (categories.split(",") as ItemCategory[])
                                : []
                            );
                            setSearchQuery(search || "");
                          }}
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Based on View Mode */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                No items found matching your criteria
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <>
              {/* Map View */}
              {viewMode === "map" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📍 {getMapPoints().length} items on map</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Lost
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Found
                    </span>
                  </div>
                  <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg bg-white">
                    <MapView
                      locations={getMapPoints()}
                      center={[40.7589, -73.9851]} // New York City center
                      zoom={11}
                      height="600px"
                    />
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="space-y-4">
                      <ItemCard
                        id={item.id}
                        type={item.type}
                        itemName={item.item_name}
                        description={item.description}
                        category={item.category}
                        locationCity={item.location_city}
                        locationCountry={item.location_country}
                        itemDate={item.item_date}
                        imageUrl={item.image_url}
                      />

                      {/* Contact Info with Masking */}
                      <ContactInfo
                        phone={item.contact_phone || ""}
                        email={item.contact_email}
                        isLoggedIn={false}
                        showFull={false}
                      />

                      {/* Share Card */}
                      <ShareCard
                        itemId={item.id}
                        itemTitle={item.item_name}
                        layout="horizontal"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card p-6 rounded-lg border"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image */}
                        {item.image_url && (
                          <div className="lg:w-48 lg:h-48 w-full h-48 flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.item_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge
                                variant={
                                  item.type === "found"
                                    ? "default"
                                    : "destructive"
                                }
                                className="mb-2"
                              >
                                {item.type.toUpperCase()}
                              </Badge>
                              <h3 className="text-xl font-semibold">
                                {item.item_name}
                              </h3>
                              <p className="text-muted-foreground">
                                {item.location_city}, {item.location_country} •{" "}
                                {item.item_date}
                              </p>
                            </div>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>

                          <p className="text-muted-foreground line-clamp-3">
                            {item.description}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <ContactInfo
                              phone={item.contact_phone || ""}
                              email={item.contact_email}
                              isLoggedIn={false}
                              showFull={false}
                            />

                            <ShareCard
                              itemId={item.id}
                              itemTitle={item.item_name}
                              layout="horizontal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
