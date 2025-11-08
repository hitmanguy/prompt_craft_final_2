import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemCardProps {
  id: string;
  type: "lost" | "found";
  itemName: string;
  description: string;
  category: string;
  locationCity: string;
  locationCountry: string;
  itemDate: string;
  imageUrl?: string;
}

const ItemCard = ({
  id,
  type,
  itemName,
  description,
  category,
  locationCity,
  locationCountry,
  itemDate,
  imageUrl,
}: ItemCardProps) => {
  return (
    <Link to={`/item/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={itemName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{itemName}</CardTitle>
            <Badge variant={type === "found" ? "default" : "secondary"}>
              {type === "found" ? "Found" : "Lost"}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {locationCity}, {locationCountry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(itemDate).toLocaleDateString()}</span>
            </div>
            <Badge variant="outline">{category}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ItemCard;
