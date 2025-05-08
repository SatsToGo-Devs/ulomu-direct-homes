
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-block bg-beige rounded-full p-4 mb-4">
              <div className="text-terracotta text-7xl font-bold">404</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find the page you were looking for. It might have been removed or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta/90">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
