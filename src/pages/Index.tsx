import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  PlusCircle,
  HeartHandshake,
  Map,
  Camera,
  Shield,
  Share2,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-4">
                  🚀 New: AI-Powered Matching & Smart Features
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  Reunite with Your{" "}
                  <span className="text-primary">Lost Items</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Advanced lost & found platform with smart matching, location
                tracking, contact masking, and instant sharing. Every item has a
                story - let's reunite them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    Smart Browse
                  </Button>
                </Link>
                <Link to="/post-item">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Post an Item
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">
                    Items Reunited
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    Smart Matching
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card p-8 rounded-2xl shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-primary" />
                    <span className="font-medium">
                      Multi-photo upload with auto-compression
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Map className="w-6 h-6 text-primary" />
                    <span className="font-medium">
                      Interactive maps with location search
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="font-medium">
                      Contact masking for privacy
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Share2 className="w-6 h-6 text-primary" />
                    <span className="font-medium">
                      One-click WhatsApp & Telegram sharing
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="font-medium">
                      Fuzzy search & smart matching
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Advanced Features for Better Matching
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform uses cutting-edge technology to help reunite lost
              items with their owners faster and more efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Map className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Location Features</h3>
              <p className="text-muted-foreground">
                Interactive maps, location autocomplete, GPS tracking, and
                geofenced alerts for better location matching.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multi-Photo Upload</h3>
              <p className="text-muted-foreground">
                Upload up to 5 photos with automatic compression, drag & drop
                support, and image carousel viewing.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Privacy Protection</h3>
              <p className="text-muted-foreground">
                Contact masking (98******42), reveal controls, and safety tips
                to protect user privacy.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Share2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Sharing</h3>
              <p className="text-muted-foreground">
                One-click WhatsApp, Telegram sharing, copy-to-clipboard, and
                native share API support.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Search</h3>
              <p className="text-muted-foreground">
                Fuzzy text matching, saved filters, recent searches, and
                intelligent suggestions for better discovery.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <HeartHandshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Status Workflow</h3>
              <p className="text-muted-foreground">
                Active → Resolved → Archived workflow with timeline tracking and
                celebration animations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            How ReUniteMe Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">
                Post with Smart Features
              </h3>
              <p className="text-muted-foreground">
                Upload multiple photos, set location with maps, choose from 12
                categories, and let our system work its magic.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Smart Discovery</h3>
              <p className="text-muted-foreground">
                Browse with fuzzy search, filter by categories, view on
                interactive maps, and get intelligent match suggestions.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Safe Contact & Share</h3>
              <p className="text-muted-foreground">
                Contact owners with privacy protection, share instantly to
                social media, and track status until reunion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            12 Item Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Electronics", icon: "📱" },
              { name: "Documents", icon: "📄" },
              { name: "Accessories", icon: "⌚" },
              { name: "Bags", icon: "🎒" },
              { name: "Keys", icon: "🔑" },
              { name: "Pets", icon: "🐕" },
              { name: "Jewelry", icon: "💍" },
              { name: "Clothing", icon: "👕" },
              { name: "Sports", icon: "⚽" },
              { name: "Books", icon: "📚" },
              { name: "Toys", icon: "🧸" },
              { name: "Other", icon: "📦" },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-card p-4 rounded-lg text-center space-y-2"
              >
                <div className="text-2xl">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Reunite?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who have successfully reunited with their
            lost items. Every reunion starts with a simple post.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline">
                Browse Items Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
