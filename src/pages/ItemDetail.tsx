import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, ArrowLeft, Eye, Flag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

// Import advanced components
import { MapView, type MapLocation } from "@/components/Map/MapView";
import { ContactInfo } from "@/components/Contact/ContactInfo";
import { ShareCard } from "@/components/Share/ShareCard";
import { ReportButton } from "@/components/Report/ReportButton";
import { StatusSelect } from "@/components/Status/StatusComponents";
import type { ReUniteItem, ItemCategory } from "@/types";

interface ItemDetail {
  id: string;
  type: "lost" | "found";
  item_name: string;
  description: string;
  category: string;
  location_address?: string;
  location_city: string;
  location_country: string;
  latitude?: number;
  longitude?: number;
  item_date: string;
  image_url?: string;
  photos?: string[];
  contact_name: string;
  contact_phone?: string;
  contact_email: string;
  status: string;
  created_at: string;
  user_id: string;
  view_count?: number;
}

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItem();
      incrementViewCount();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data as ItemDetail);
      setViewCount((data as any).view_count || 0);
    } catch (error) {
      console.error("Error fetching item:", error);
      toast({
        title: "Error",
        description: "Failed to load item details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      // Simple view count increment without RPC
      setViewCount((prev) => prev + 1);
    } catch (error) {
      // Silently fail view count increment
    }
  };

  const handleStatusUpdate = async (
    newStatus: "active" | "resolved" | "archived"
  ) => {
    if (!item || !user || item.user_id !== user.id) {
      toast({
        title: "Error",
        description: "You don't have permission to update this item",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Updating status to:", newStatus, "for item:", item.id);

      const { error } = await supabase
        .from("items")
        .update({ status: newStatus })
        .eq("id", item.id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Update local state
      setItem((prev) => (prev ? { ...prev, status: newStatus } : null));

      toast({
        title: "Success!",
        description: `Item status updated to ${newStatus}.`,
      });

      if (newStatus === "resolved") {
        // Could trigger celebration animation
        toast({
          title: "🎉 Reunited!",
          description: "Congratulations on reuniting this item with its owner!",
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Error",
        description: `Failed to update item status: ${error.message || error}`,
        variant: "destructive",
      });
    }
  };

  const getAllPhotos = () => {
    const photos = [];
    if (item?.image_url) photos.push(item.image_url);
    if (item?.photos) photos.push(...item.photos);
    return [...new Set(photos)]; // Remove duplicates
  };

  const getMapItems = (): MapLocation[] => {
    if (!item?.latitude || !item?.longitude) return [];
    return [
      {
        id: item.id,
        lat: item.latitude,
        lng: item.longitude,
        title: item.item_name,
        address: `${item.location_city}, ${item.location_country}`,
        color: item.type === "found" ? "#10B981" : "#EF4444",
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Button onClick={() => navigate("/browse")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const photos = getAllPhotos();
  const isOwner = user?.id === item.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Photos & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-0">
                {photos.length > 0 ? (
                  <div className="relative">
                    <img
                      src={photos[currentPhotoIndex]}
                      alt={item.item_name}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />

                    {photos.length > 1 && (
                      <>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex gap-2">
                            {photos.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentPhotoIndex
                                    ? "bg-white"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {currentPhotoIndex > 0 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              setCurrentPhotoIndex((prev) => prev - 1)
                            }
                          >
                            ←
                          </Button>
                        )}

                        {currentPhotoIndex < photos.length - 1 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              setCurrentPhotoIndex((prev) => prev + 1)
                            }
                          >
                            →
                          </Button>
                        )}

                        {/* Thumbnail strip */}
                        <div className="p-4 flex gap-2 overflow-x-auto">
                          {photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPhotoIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                                index === currentPhotoIndex
                                  ? "border-primary"
                                  : "border-transparent"
                              }`}
                            >
                              <img
                                src={photo}
                                alt={`${item.item_name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            {item.latitude && item.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg bg-white">
                    <MapView
                      locations={getMapItems()}
                      center={[item.latitude, item.longitude]}
                      zoom={15}
                      height="320px"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold">{item.item_name}</h1>
                  <Badge
                    variant={item.type === "found" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {item.type === "found" ? "Found" : "Lost"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {viewCount} views
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      {item.location_address && <p>{item.location_address}</p>}
                      <p>
                        {item.location_city}, {item.location_country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p>
                      {item.type === "found" ? "Found on" : "Lost on"}{" "}
                      {new Date(item.item_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Management (Owner only) */}
            {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Status Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusSelect
                    value={item.status as any}
                    onChange={handleStatusUpdate}
                    disabled={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactInfo
                  phone={item.contact_phone || ""}
                  email={item.contact_email}
                  isLoggedIn={!!user}
                  showFull={isOwner}
                />
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card>
              <CardHeader>
                <CardTitle>Share this item</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareCard
                  itemId={item.id}
                  itemTitle={item.item_name}
                  layout="vertical"
                />
              </CardContent>
            </Card>

            {/* Report Button (for non-owners) */}
            {!isOwner && user && (
              <Card>
                <CardContent className="pt-6">
                  <ReportButton itemId={item.id} />
                </CardContent>
              </Card>
            )}

            {/* Login prompt for non-users */}
            {!user && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Sign in to contact the owner and access all features
                  </p>
                  <Button className="w-full" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
