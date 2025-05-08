
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Calendar, MapPin } from "lucide-react";

// Mock data for property details
const propertiesData = [
  {
    id: "1",
    title: "Modern 2-Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦1,500,000/year",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
    ],
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    size: "120 sqm",
    furnished: "Semi-Furnished",
    description: "This modern apartment is located in the heart of Lekki Phase 1. It features 2 spacious bedrooms, 2 bathrooms, a large living area, and a fully fitted kitchen. The apartment comes with 24/7 power supply, water, and security. It is perfect for professionals or small families looking for comfort and convenience.",
    amenities: ["24/7 Electricity", "Security", "Water Supply", "Parking Space", "Swimming Pool", "Gym"],
    landlord: {
      name: "Mr. Oluwaseun Adegoke",
      joinedDate: "March 2022",
      responseRate: "95%",
      verified: true,
    }
  },
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = propertiesData.find((p) => p.id === id);

  if (!property) {
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
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Property Images */}
        <div className="bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`${index === 0 ? 'md:col-span-2 rounded-lg overflow-hidden' : 'rounded-lg overflow-hidden'}`}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover aspect-[16/10]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Property Info */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-terracotta">{property.propertyType}</Badge>
                  <Badge variant="outline">{property.bedrooms} Bedrooms</Badge>
                  <Badge variant="outline">{property.bathrooms} Bathrooms</Badge>
                  <Badge variant="outline">{property.size}</Badge>
                  <Badge variant="outline">{property.furnished}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={18} className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <p className="text-2xl font-semibold text-terracotta">{property.price}</p>
              </div>
              
              <Tabs defaultValue="description" className="mb-8">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="bg-white p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-3">About this property</h3>
                  <p className="text-gray-700">{property.description}</p>
                </TabsContent>
                <TabsContent value="amenities" className="bg-white p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-2 w-2 bg-terracotta rounded-full mr-2"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="location" className="bg-white p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-3">Location</h3>
                  <div className="bg-gray-200 h-64 flex items-center justify-center rounded-md">
                    <p className="text-gray-500">Map will be displayed here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Landlord Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Landlord Information</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                      {property.landlord.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{property.landlord.name}</p>
                      <p className="text-sm text-gray-600">Member since {property.landlord.joinedDate}</p>
                    </div>
                    {property.landlord.verified && (
                      <Badge className="ml-auto bg-forest">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Response rate: {property.landlord.responseRate}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-terracotta hover:bg-terracotta/90 flex items-center gap-2">
                      <MessageCircle size={18} />
                      Contact
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar size={18} />
                      Book Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Inquiry Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Interested in this property?</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        placeholder="I'm interested in this property and would like more information..."
                      ></textarea>
                    </div>
                    <Button className="w-full bg-terracotta hover:bg-terracotta/90">
                      Send Inquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
