import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Mail, Phone, User, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface ItemDetail {
  id: string;
  type: "lost" | "found";
  item_name: string;
  description: string;
  category: string;
  location_address?: string;
  location_city: string;
  location_country: string;
  item_date: string;
  image_url?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email: string;
  status: string;
  created_at: string;
  user_id: string;
}

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItem();
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

  const handleMarkAsReunited = async () => {
    if (!item || !user || item.user_id !== user.id) return;

    try {
      const { error } = await supabase
        .from("items")
        .update({ status: "reunited" })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Item marked as reunited.",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate("/browse")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.item_name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{item.item_name}</h1>
                <Badge variant={item.type === "found" ? "default" : "secondary"} className="text-sm">
                  {item.type === "found" ? "Found" : "Lost"}
                </Badge>
              </div>
              <Badge variant="outline">{item.category}</Badge>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="font-semibold">Location & Date</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      {item.location_address && <p>{item.location_address}</p>}
                      <p>
                        {item.location_city}, {item.location_country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <p>{new Date(item.item_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h2 className="font-semibold">Contact Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <p>{item.contact_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <a
                        href={`mailto:${item.contact_email}`}
                        className="text-primary hover:underline"
                      >
                        {item.contact_email}
                      </a>
                    </div>
                    {item.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <a
                          href={`tel:${item.contact_phone}`}
                          className="text-primary hover:underline"
                        >
                          {item.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Sign in to view contact information
                  </p>
                  <Button className="w-full" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}

            {user && item.user_id === user.id && item.status === "active" && (
              <Button onClick={handleMarkAsReunited} className="w-full">
                Mark as Reunited
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
