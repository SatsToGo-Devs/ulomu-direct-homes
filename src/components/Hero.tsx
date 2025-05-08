
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-beige">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Find Your Next Home <span className="text-terracotta">Directly</span> From Landlords
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              No agents. No hidden fees. Ulomu connects you directly with property owners, 
              making house hunting in Nigeria simple, transparent, and stress-free.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white font-medium">
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl">
            <div className="bg-white p-6 rounded-t-lg">
              <h3 className="text-lg font-medium text-gray-900">Find Your Perfect Home</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                    <option>Ibadan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Duplex</option>
                    <option>Office Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option>₦100,000 - ₦500,000</option>
                    <option>₦500,000 - ₦1,000,000</option>
                    <option>₦1,000,000 - ₦5,000,000</option>
                    <option>Above ₦5,000,000</option>
                  </select>
                </div>
                <Button className="w-full bg-terracotta hover:bg-terracotta/90">
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
