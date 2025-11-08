import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-image.jpg";
import foundIllustration from "@/assets/found-illustration.png";
import lostIllustration from "@/assets/lost-illustration.png";

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
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Reunite with Your{" "}
                <span className="text-primary">Lost Items</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Every day, people lose and find items. We help connect them. Report what you've lost or found, and let's reunite belongings with their owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Items
                  </Button>
                </Link>
                <Link to="/post-item">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Post an Item
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Lost and Found"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-32 h-32 mx-auto">
                <img src={lostIllustration} alt="Report Lost" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold">Report Lost Items</h3>
              <p className="text-muted-foreground">
                Lost something? Create a post with details and photos to help others identify your item.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-32 h-32 mx-auto">
                <img src={foundIllustration} alt="Report Found" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold">Report Found Items</h3>
              <p className="text-muted-foreground">
                Found something? Post it here and help reunite it with its rightful owner.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm text-center space-y-4">
              <div className="w-32 h-32 mx-auto flex items-center justify-center">
                <HeartHandshake className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Get Reunited</h3>
              <p className="text-muted-foreground">
                Browse listings, connect with item owners, and make someone's day by returning their belongings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Help?</h2>
          <p className="text-xl text-muted-foreground">
            Join our community and make a difference. Every item returned is a story of hope and kindness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline">
                Browse Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
