
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface PropertyHeaderProps {
  property: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    size: string;
    furnished: string;
    title: string;
    location: string;
    price: string;
  };
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  return (
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
  );
};

export default PropertyHeader;
