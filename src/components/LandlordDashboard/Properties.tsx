
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2, Eye, Building, MapPin, Users } from 'lucide-react';
import EditPropertyModal from '@/components/PropertyManagement/EditPropertyModal';

const Properties = () => {
  const navigate = useNavigate();
  const { properties, loading, fetchProperties } = useProperties();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || property.property_type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return (a.property_type || '').localeCompare(b.property_type || '');
        case 'units':
          return (b.units_count || 0) - (a.units_count || 0);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const handleDeleteProperty = async (propertyId: string, propertyName: string) => {
    try {
      // First delete all units associated with the property
      const { error: unitsError } = await supabase
        .from('units')
        .delete()
        .eq('property_id', propertyId);

      if (unitsError) throw unitsError;

      // Then delete the property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (propertyError) throw propertyError;

      toast({
        title: "Success",
        description: `Property "${propertyName}" deleted successfully`,
      });

      fetchProperties(); // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="text-forest">Properties</CardTitle>
          <CardDescription>Loading your properties...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-ulomu-beige rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-ulomu-beige-dark">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-forest">Properties Management</CardTitle>
            <CardDescription>
              Manage all your properties ({properties.length} total)
            </CardDescription>
          </div>
          <Button 
            onClick={() => navigate('/add-property')}
            className="bg-terracotta hover:bg-terracotta/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search properties by name, address, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-ulomu-beige-dark"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="RESIDENTIAL">Residential</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              <SelectItem value="MIXED_USE">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="type">Property Type</SelectItem>
              <SelectItem value="units">Unit Count</SelectItem>
              <SelectItem value="date">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-ulomu-beige rounded-lg">
            {properties.length === 0 ? (
              <>
                <Building className="h-16 w-16 text-forest mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-forest mb-2">No Properties Yet</h3>
                <p className="text-gray-600 mb-4">Start building your property portfolio</p>
                <Button 
                  onClick={() => navigate('/add-property')}
                  className="bg-terracotta hover:bg-terracotta/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </>
            ) : (
              <>
                <Search className="h-16 w-16 text-forest mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-forest mb-2">No Properties Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-ulomu-beige-dark">
                  <TableHead className="text-forest font-semibold">Property</TableHead>
                  <TableHead className="text-forest font-semibold">Location</TableHead>
                  <TableHead className="text-forest font-semibold">Type</TableHead>
                  <TableHead className="text-forest font-semibold">Units</TableHead>
                  <TableHead className="text-forest font-semibold">Status</TableHead>
                  <TableHead className="text-forest font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-ulomu-beige-dark hover:bg-ulomu-beige/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.name}
                            className="w-12 h-12 rounded-lg object-cover border border-ulomu-beige-dark"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-ulomu-beige border border-ulomu-beige-dark flex items-center justify-center">
                            <Building className="h-6 w-6 text-forest" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{property.name}</p>
                          <p className="text-sm text-gray-500">
                            Added {new Date(property.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-forest mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm">{property.address}</p>
                          {(property.city || property.state) && (
                            <p className="text-xs text-gray-500">
                              {property.city && property.city}
                              {property.city && property.state && ', '}
                              {property.state && property.state}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="bg-forest/10 text-forest border-forest/30"
                      >
                        {property.property_type || 'Residential'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-ulomu-gold" />
                        <span className="font-medium">{property.units_count || 1}</span>
                        <span className="text-sm text-gray-500">
                          {(property.units_count || 1) === 1 ? 'unit' : 'units'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-forest text-white">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="border-ulomu-beige-dark hover:bg-ulomu-beige"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <EditPropertyModal 
                          property={property} 
                          onPropertyUpdated={fetchProperties}
                        />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Property</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{property.name}"? This action cannot be undone and will also delete all associated units and data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProperty(property.id, property.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Property
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Properties;
