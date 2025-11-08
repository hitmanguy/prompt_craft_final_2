import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Heart, Share2, Flag } from "lucide-react";
import { ReUniteItem } from "@/types";
import ContactInfo from "@/components/Contact/ContactInfo";
import {
  StatusBadge,
  StatusTimeline,
} from "@/components/Status/StatusComponents";
import ShareCard from "@/components/Share/ShareCard";
import ReportButton from "@/components/Report/ReportButton";
import { MapView } from "@/components/Map/MapView";
import { CategoryBadge } from "@/components/Category/CategoryComponents";
import { getTimeAgo } from "@/lib/helpers";

export const ItemDetailIntegration: React.FC<{ item?: ReUniteItem }> = ({
  item = {
    id: "1",
    title: "Black iPhone 14 Pro with Blue Case",
    description:
      "Lost my iPhone 14 Pro with a blue Spigen case at IITK campus on Nov 8. Has a screen protector and a silver ring holder attached. Last seen near Lecture Hall Complex.",
    itemType: "lost",
    category: "phone",
    tags: [
      { id: "1", name: "iPhone", confidence: 0.95, isAI: true },
      { id: "2", name: "blue case", confidence: 0.88, isAI: true },
      { id: "3", name: "expensive", isAI: false },
    ],
    photos: [
      {
        id: "1",
        url: "https://via.placeholder.com/600x600?text=iPhone+Front",
        compressedUrl: "https://via.placeholder.com/300x300?text=iPhone+Front",
        size: 1024000,
        uploadedAt: "2025-11-08T10:00:00Z",
        order: 0,
      },
    ],
    location: {
      latitude: 20.5937,
      longitude: 78.9629,
      address: "Lecture Hall Complex, IITK Campus, Kanpur",
      city: "Kanpur",
      state: "Uttar Pradesh",
      country: "India",
      zipCode: "208016",
    },
    status: "active",
    userId: "user-123",
    userPhone: "+919876543210",
    userEmail: "user@example.com",
    createdAt: "2025-11-08T10:00:00Z",
    updatedAt: "2025-11-08T10:00:00Z",
    viewCount: 45,
    reportCount: 0,
  },
}) => {
  const [liked, setLiked] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const isLoggedIn = true; // TODO: Get from auth context

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={item.status} />
            <Badge variant="outline">
              {item.itemType === "lost" ? "🔴 Lost Item" : "🟢 Found Item"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-600 mt-1">{getTimeAgo(item.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setLiked(!liked)}
            className={liked ? "text-red-500" : "text-gray-400"}
          >
            <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photos & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Carousel */}
          <Card className="overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {item.photos.map((photo, index) => (
                  <CarouselItem key={photo.id}>
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-96 object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {item.photos.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          </Card>

          {/* Category & Tags */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-2">
                  Category
                </h3>
                <CategoryBadge category={item.category} size="lg" />
              </div>

              {item.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                        {tag.isAI && (
                          <span className="ml-1 text-xs">✨ AI</span>
                        )}
                        {tag.confidence && (
                          <span className="ml-1 text-xs">
                            ({Math.round(tag.confidence * 100)}%)
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {item.description}
            </p>
          </Card>

          {/* Location */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Location</h3>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{item.location.address}</p>
                <p className="text-sm text-gray-600">
                  {item.location.city}, {item.location.state}{" "}
                  {item.location.zipCode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.location.latitude.toFixed(4)},{" "}
                  {item.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Map View */}
            <MapView
              locations={[
                {
                  id: item.id,
                  lat: item.location.latitude,
                  lng: item.location.longitude,
                  title: item.title,
                  address: item.location.address,
                },
              ]}
              center={[item.location.latitude, item.location.longitude]}
              zoom={12}
              height="h-64"
            />
          </Card>

          {/* Status Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Status Timeline</h3>
            <StatusTimeline
              createdAt={item.createdAt}
              resolvedAt={item.resolvedAt}
              archivedAt={item.archivedAt}
            />
          </Card>

          {/* Possible Matches */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Possible Matches</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI found 2 items that might be related to yours
            </p>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card
                  key={i}
                  className="p-3 flex gap-3 cursor-pointer hover:bg-gray-50"
                >
                  <img
                    src={`https://via.placeholder.com/80x80?text=Match${i}`}
                    alt="Match"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Blue iPhone Found Near Gate
                    </p>
                    <p className="text-xs text-gray-600">
                      Found 5 days ago · 2 km away
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      98% match confidence
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Check
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Contact & Actions */}
        <div className="space-y-4">
          {/* Contact Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <ContactInfo
              phone={item.userPhone}
              email={item.userEmail}
              isLoggedIn={isLoggedIn}
            />
          </Card>

          {/* Action Buttons */}
          <Card className="p-6 space-y-3">
            <Button className="w-full" size="lg">
              Message Owner
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowContactInfo(true)}
            >
              Share Contact Safely
            </Button>
          </Card>

          {/* Sharing */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Share This Item</h3>
            <ShareCard
              itemId={item.id}
              itemTitle={item.title}
              layout="vertical"
              size="sm"
            />
          </Card>

          {/* Report */}
          <Card className="p-6">
            <ReportButton itemId={item.id} />
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold">{item.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reports</span>
                <span className="font-semibold">{item.reportCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posted</span>
                <span className="font-semibold">
                  {getTimeAgo(item.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          {/* Safety Tips */}
          <Card className="p-4 bg-yellow-50 border border-yellow-200">
            <h4 className="font-semibold text-sm text-yellow-900 mb-2">
              Safety Tips
            </h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• Verify the person before meeting</li>
              <li>• Meet in a safe, public place</li>
              <li>• Bring someone with you</li>
              <li>• Share location with a friend</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailIntegration;
