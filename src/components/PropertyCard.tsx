
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Users, Edit, Eye } from 'lucide-react';
import { Property } from '@/hooks/useProperties';

interface PropertyCardProps {
  property: Property;
  onView?: (property: Property) => void;
  onEdit?: (property: Property) => void;
}

const PropertyCard = ({ property, onView, onEdit }: PropertyCardProps) => {
  const primaryImage = property.images?.[0];
  
  const formatPropertyType = (type?: string) => {
    if (!type) return 'Property';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-beige to-beige/80">
            <Building className="h-16 w-16 text-terracotta/50" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-terracotta text-white">
            {formatPropertyType(property.property_type)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{property.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-terracotta" />
            <span className="line-clamp-1">
              {property.address}
              {property.city && `, ${property.city}`}
              {property.state && `, ${property.state}`}
            </span>
          </div>
          
          {property.units_count && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-forest" />
              <span>{property.units_count} units</span>
            </div>
          )}
        </div>

        {property.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {property.description}
          </p>
        )}

        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView?.(property)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit?.(property)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
