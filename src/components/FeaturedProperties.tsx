
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const properties = [
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
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Link to="/properties" className="text-terracotta hover:underline font-medium">
            View all properties
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
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
    </section>
  );
};

export default FeaturedProperties;
