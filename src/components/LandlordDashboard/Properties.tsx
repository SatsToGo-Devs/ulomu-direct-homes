
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';

const Properties = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();

  const handleViewProperty = (property: any) => {
    navigate(`/property/${property.id}`);
  };

  const handleEditProperty = (property: any) => {
    // Navigate to edit page (to be implemented)
    console.log('Edit property:', property);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
          <CardDescription>Loading your properties...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>
              Manage all your property listings ({properties.length} properties)
            </CardDescription>
          </div>
          <Button 
            onClick={() => navigate('/add-property')}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 mb-4">Start building your property portfolio</p>
            <Button 
              onClick={() => navigate('/add-property')}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={handleViewProperty}
                onEdit={handleEditProperty}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Properties;
