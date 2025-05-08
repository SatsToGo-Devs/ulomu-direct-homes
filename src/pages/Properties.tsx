
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";

// Mock data for properties
const propertiesData = [
  {
    id: 1,
    title: "Modern 2-Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦1,500,000/year",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: 2,
    title: "Spacious 3-Bedroom Duplex",
    location: "Ikoyi, Lagos",
    price: "₦6,000,000/year",
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=2074&auto=format&fit=crop",
    propertyType: "Duplex",
    bedrooms: 3,
    bathrooms: 3,
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    location: "Yaba, Lagos",
    price: "₦800,000/year",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    propertyType: "Studio",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 4,
    title: "Executive 4-Bedroom House",
    location: "Victoria Island, Lagos",
    price: "₦12,000,000/year",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 4,
  },
  {
    id: 5,
    title: "Luxury 2-Bedroom Flat",
    location: "Ikeja GRA, Lagos",
    price: "₦2,500,000/year",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    propertyType: "Flat",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: 6,
    title: "Serviced 3-Bedroom Apartment",
    location: "Oniru, Lagos",
    price: "₦4,500,000/year",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
  },
  {
    id: 7,
    title: "1-Bedroom Mini Flat",
    location: "Surulere, Lagos",
    price: "₦700,000/year",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop",
    propertyType: "Mini Flat",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 8,
    title: "5-Bedroom Detached House",
    location: "Banana Island, Lagos",
    price: "₦25,000,000/year",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    propertyType: "House",
    bedrooms: 5,
    bathrooms: 6,
  },
];

const Properties = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-beige py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Find Your Perfect Home</h1>
          <p className="text-gray-700">Browse properties directly from landlords, no agent fees</p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <aside className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option value="">All Locations</option>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                    <option>Ibadan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option value="">All Types</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Duplex</option>
                    <option>Studio</option>
                    <option>Office Space</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option value="">Any Price</option>
                    <option>Under ₦500,000</option>
                    <option>₦500,000 - ₦1,000,000</option>
                    <option>₦1,000,000 - ₦5,000,000</option>
                    <option>Above ₦5,000,000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option value="">Any</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 text-gray-800">
                    <option value="">Any</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3+</option>
                  </select>
                </div>
                
                <Button className="w-full bg-terracotta hover:bg-terracotta/90">
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>
          
          {/* Properties Listing */}
          <div className="md:w-3/4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
              <Button 
                variant="outline" 
                className="sm:w-auto w-full flex items-center gap-2 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {/* Results count */}
            <div className="mb-4">
              <p className="text-gray-600">{propertiesData.length} properties found</p>
            </div>
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesData.map((property) => (
                <Link to={`/properties/${property.id}`} key={property.id}>
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div 
                      className="h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${property.image})` }}
                    />
                    <CardContent className="p-4">
                      <Badge className="bg-terracotta mb-2">{property.propertyType}</Badge>
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <div>{property.bedrooms} Beds</div>
                        <div>{property.bathrooms} Baths</div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-4 py-3 border-t">
                      <p className="font-medium text-terracotta">{property.price}</p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;
