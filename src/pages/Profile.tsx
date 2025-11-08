import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ItemCard from "@/components/ItemCard";

interface UserItem {
  id: string;
  type: "lost" | "found";
  item_name: string;
  description: string;
  category: string;
  location_city: string;
  location_country: string;
  item_date: string;
  image_url?: string;
  status: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [user]);

  const fetchUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data as UserItem[]) || []);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeItems = items.filter((item) => item.status === "active");
  const reunitedItems = items.filter((item) => item.status === "reunited");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Email:</span> {user?.email}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Active Items</p>
                      <p className="text-2xl font-bold text-primary">{activeItems.length}</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Reunited Items</p>
                      <p className="text-2xl font-bold text-accent">{reunitedItems.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4">My Items</h2>
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">
                    Active <Badge className="ml-2">{activeItems.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="reunited">
                    Reunited <Badge className="ml-2">{reunitedItems.length}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : activeItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">You haven't posted any active items yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeItems.map((item) => (
                        <ItemCard
                          key={item.id}
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
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reunited" className="mt-6">
                  {reunitedItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No reunited items yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {reunitedItems.map((item) => (
                        <ItemCard
                          key={item.id}
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
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
