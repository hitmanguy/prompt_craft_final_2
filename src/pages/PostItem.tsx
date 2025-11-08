import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MapView } from "@/components/Map/MapView";

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Accessories",
  "Bags",
  "Keys",
  "Pets",
  "Jewelry",
  "Clothing",
  "Sports",
  "Books",
  "Toys",
  "Other",
];

const PostItem = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [itemType, setItemType] = useState<"lost" | "found">("found");
  const [latitude, setLatitude] = useState<number>(40.7831); // Default to NYC
  const [longitude, setLongitude] = useState<number>(-73.9712);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submission started");
    console.log("User:", user);

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post an item",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type") as string,
      itemName: formData.get("itemName") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      locationAddress: formData.get("locationAddress") as string,
      locationCity: formData.get("locationCity") as string,
      locationCountry: formData.get("locationCountry") as string,
      itemDate: formData.get("itemDate") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactEmail: formData.get("contactEmail") as string,
    };

    console.log("Form data:", data);

    try {
      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image:", imageFile.name);
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        console.log("Image uploaded:", imageUrl);
      }

      console.log("Inserting item into database...");
      const { error } = await supabase.from("items").insert({
        user_id: user.id,
        type: data.type,
        item_name: data.itemName,
        description: data.description,
        category: data.category,
        location_address: data.locationAddress || null,
        location_city: data.locationCity,
        location_country: data.locationCountry,
        // latitude: latitude,  // Temporarily disabled until DB migration
        // longitude: longitude, // Temporarily disabled until DB migration
        item_date: data.itemDate,
        contact_name: data.contactName,
        contact_phone: data.contactPhone || null,
        contact_email: data.contactEmail,
        image_url: imageUrl,
        status: "active",
      });

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      console.log("Item posted successfully!");
      toast({
        title: "Success!",
        description: `Your ${data.type} item has been posted successfully.`,
      });
      navigate("/browse");
    } catch (error: any) {
      console.error("Error posting item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Post an Item</CardTitle>
              <CardDescription>
                Report a lost or found item to help reconnect it with its owner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-3">
                  <Label>Item Status *</Label>
                  <RadioGroup
                    name="type"
                    value={itemType}
                    onValueChange={(value) =>
                      setItemType(value as "lost" | "found")
                    }
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="found" id="found" />
                      <Label
                        htmlFor="found"
                        className="font-normal cursor-pointer"
                      >
                        I found this item
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lost" id="lost" />
                      <Label
                        htmlFor="lost"
                        className="font-normal cursor-pointer"
                      >
                        I lost this item
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Item Details */}
                <div className="space-y-2">
                  <Label htmlFor="itemName">What did you find/lose? *</Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    placeholder="e.g., Green backpack, iPhone 14, Car keys"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide detailed description: color, size, brand, distinctive features, where/when found/lost..."
                    rows={4}
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Photo of the Item</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="image" className="cursor-pointer">
                        <div className="space-y-2">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload an image (max 5MB)
                          </p>
                        </div>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Location Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="locationAddress">Address</Label>
                    <Input
                      id="locationAddress"
                      name="locationAddress"
                      placeholder="e.g., 260 Broadway"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locationCity">City *</Label>
                      <Input
                        id="locationCity"
                        name="locationCity"
                        placeholder="e.g., New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationCountry">Country *</Label>
                      <Input
                        id="locationCountry"
                        name="locationCountry"
                        placeholder="e.g., USA"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) =>
                          setLatitude(parseFloat(e.target.value) || 40.7831)
                        }
                        placeholder="40.7831"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) =>
                          setLongitude(parseFloat(e.target.value) || -73.9712)
                        }
                        placeholder="-73.9712"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      📍 Use your device location or enter coordinates manually.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setLatitude(position.coords.latitude);
                              setLongitude(position.coords.longitude);
                              toast({
                                title: "Location updated",
                                description:
                                  "Your current location has been set.",
                              });
                            }
                          );
                        }
                      }}
                    >
                      Use Current Location
                    </Button>
                  </div>

                  {/* Interactive Map Location Picker */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Click on map to set exact location
                    </Label>
                    <div className="border rounded-lg overflow-hidden">
                      <MapView
                        center={[latitude, longitude]}
                        zoom={13}
                        height="300px"
                        editable={true}
                        onLocationSelect={(location) => {
                          setLatitude(location.latitude);
                          setLongitude(location.longitude);
                          toast({
                            title: "Location set",
                            description: `Location set to ${location.latitude.toFixed(
                              4
                            )}, ${location.longitude.toFixed(4)}`,
                          });
                        }}
                        locations={[
                          {
                            id: "selected",
                            lat: latitude,
                            lng: longitude,
                            title: "Selected Location",
                            address: "Click anywhere on map to change location",
                          },
                        ]}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemDate">
                    Date {itemType === "lost" ? "Lost" : "Found"} *
                  </Label>
                  <Input id="itemDate" name="itemDate" type="date" required />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Your Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your phone will be masked as 98******42 in public listings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Your email will be masked as jo****@ex*****.com in public
                      listings
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Posting..."
                    : `Post ${itemType === "lost" ? "Lost" : "Found"} Item`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostItem;
