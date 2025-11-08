import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ItemType, ItemCategory } from "@/types";
import LocationPicker from "@/components/Map/LocationPicker";
import { CategorySelect } from "@/components/Category/CategoryComponents";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { StatusSelect } from "@/components/Status/StatusComponents";

export const PostItemIntegration: React.FC = () => {
  const [itemType, setItemType] = useState<ItemType>("lost");
  const [category, setCategory] = useState<ItemCategory>("other");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || photos.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call Supabase API to create item
      // 1. Upload photos to storage
      // 2. Create item record with location
      // 3. Generate AI tags from photos/description
      // 4. Trigger match suggestions

      toast.success("Item posted successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setPhotos([]);
      setLocation(null);
    } catch (error) {
      toast.error("Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Post an Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Type */}
        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">
            Item Type
          </Label>
          <RadioGroup
            value={itemType}
            onValueChange={(val) => setItemType(val as ItemType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="font-normal cursor-pointer">
                I Lost an Item
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found" className="font-normal cursor-pointer">
                I Found an Item
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Category */}
        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">
            Category *
          </Label>
          <CategorySelect value={category} onChange={setCategory} />
        </Card>

        {/* Title & Description */}
        <Card className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Item Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Black iPhone 14 Pro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the item in detail... (AI will auto-tag this)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
              required
            />
          </div>
        </Card>

        {/* Photos */}
        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">Photos *</Label>
          <ImageUpload photos={photos} onChange={setPhotos} maxPhotos={5} />
        </Card>

        {/* Location */}
        <Card className="p-6">
          <Label className="text-base font-semibold mb-4 block">
            Location *
          </Label>
          <LocationPicker onSelect={setLocation} />
        </Card>

        {/* Submit */}
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Posting..." : "Post Item"}
        </Button>
      </form>
    </div>
  );
};

export default PostItemIntegration;
