
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PropertyNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you are looking for does not exist or has been removed.</p>
        <Button asChild className="bg-terracotta hover:bg-terracotta/90">
          <a href="/properties">Browse All Properties</a>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyNotFound;
