
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, Mail, Phone, Trash2, Building, UserPlus, Home, MapPin, Calendar } from 'lucide-react';
import CreateTenantModal from '@/components/TenantManagement/CreateTenantModal';
import TenantUnitManager from '@/components/TenantManagement/TenantUnitManager';
import PropertyOccupancy from '@/components/TenantManagement/PropertyOccupancy';

const Tenants = () => {
  const { tenants, loading: tenantsLoading, deleteTenant, fetchTenants } = useTenants();
  const { properties, loading: propertiesLoading } = useProperties();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterProperty === 'all') return matchesSearch;
    
    const matchesProperty = tenant.units?.some(unit => unit.property_id === filterProperty);
    return matchesSearch && matchesProperty;
  });

  // Group tenants by property
  const tenantsByProperty = properties.map(property => {
    const propertyTenants = tenants.filter(tenant => 
      tenant.units?.some(unit => unit.property_id === property.id)
    );
    
    const occupiedUnits = propertyTenants.reduce((total, tenant) => {
      return total + (tenant.units?.filter(unit => unit.property_id === property.id).length || 0);
    }, 0);

    return {
      ...property,
      tenants: propertyTenants,
      occupiedUnits,
      totalUnits: property.units_count || 0
    };
  });

  if (tenantsLoading || propertiesLoading) {
    return (
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="text-forest">Tenants Management</CardTitle>
          <CardDescription>Loading tenant information...</CardDescription>
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
            <CardTitle className="text-forest flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tenants Management
            </CardTitle>
            <CardDescription>
              Manage all your tenants ({tenants.length} total)
            </CardDescription>
          </div>
          <CreateTenantModal />
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tenants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-ulomu-beige-dark"
            />
          </div>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="by-property" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-property" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
              By Property
            </TabsTrigger>
            <TabsTrigger value="all-tenants" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
              All Tenants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-property" className="space-y-6">
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-ulomu-beige rounded-lg">
                <Building className="h-16 w-16 text-forest mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-forest mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Add properties first to manage tenants</p>
                <Button 
                  onClick={() => window.location.href = '/add-property'}
                  className="bg-terracotta hover:bg-terracotta/90 text-white"
                >
                  Add Property
                </Button>
              </div>
            ) : (
              tenantsByProperty.map((property) => (
                <Card key={property.id} className="border-ulomu-beige-dark">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-forest rounded-lg">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-forest">{property.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-ulomu-gold/20 text-ulomu-gold border-ulomu-gold/30">
                          {property.tenants.length} tenant{property.tenants.length !== 1 ? 's' : ''}
                        </Badge>
                        <TenantUnitManager
                          propertyId={property.id}
                          propertyName={property.name}
                          onTenantAdded={fetchTenants}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PropertyOccupancy
                      totalUnits={property.totalUnits}
                      occupiedUnits={property.occupiedUnits}
                      propertyName={property.name}
                    />
                    
                    {property.tenants.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No tenants in this property</p>
                        <TenantUnitManager
                          propertyId={property.id}
                          propertyName={property.name}
                          onTenantAdded={fetchTenants}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {property.tenants.map((tenant) => (
                          <div key={tenant.id} className="border rounded-lg p-4 bg-ulomu-beige">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-forest">
                                    {tenant.first_name} {tenant.last_name}
                                  </h4>
                                  <Badge className="bg-forest text-white">Active</Badge>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-terracotta" />
                                    {tenant.email}
                                  </div>
                                  {tenant.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-forest" />
                                      {tenant.phone}
                                    </div>
                                  )}
                                </div>

                                {tenant.units && tenant.units.map((unit) => (
                                  <div key={unit.id} className="bg-white p-3 rounded-lg mb-2 border border-ulomu-beige-dark">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-forest" />
                                        <span className="font-medium">Unit {unit.unit_number}</span>
                                      </div>
                                      <span className="text-terracotta font-semibold">
                                        ₦{unit.rent_amount.toLocaleString()}/month
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {tenant.first_name} {tenant.last_name}? This will also remove them from any units.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteTenant(tenant.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="all-tenants" className="space-y-6">
            {filteredTenants.length === 0 ? (
              <div className="text-center py-12 bg-ulomu-beige rounded-lg">
                <Users className="h-16 w-16 text-forest mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-forest mb-2">
                  {searchTerm || filterProperty !== 'all' ? 'No tenants found' : 'No tenants yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterProperty !== 'all' 
                    ? 'Try adjusting your search terms or filters' 
                    : 'Start by adding your first tenant'
                  }
                </p>
                {!searchTerm && filterProperty === 'all' && <CreateTenantModal />}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ulomu-beige-dark">
                      <TableHead className="text-forest font-semibold">Tenant</TableHead>
                      <TableHead className="text-forest font-semibold">Contact</TableHead>
                      <TableHead className="text-forest font-semibold">Property & Unit</TableHead>
                      <TableHead className="text-forest font-semibold">Rent</TableHead>
                      <TableHead className="text-forest font-semibold">Status</TableHead>
                      <TableHead className="text-forest font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="border-ulomu-beige-dark hover:bg-ulomu-beige/50 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-forest">
                              {tenant.first_name} {tenant.last_name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {new Date(tenant.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-terracotta" />
                              <span className="text-sm">{tenant.email}</span>
                            </div>
                            {tenant.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-forest" />
                                <span className="text-sm">{tenant.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {tenant.units && tenant.units.length > 0 ? (
                            <div className="space-y-1">
                              {tenant.units.map((unit) => (
                                <div key={unit.id} className="flex items-center gap-2">
                                  <Building className="h-3 w-3 text-forest" />
                                  <span className="text-sm font-medium">{unit.properties.name}</span>
                                  <span className="text-xs text-gray-500">- Unit {unit.unit_number}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No units assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {tenant.units && tenant.units.length > 0 ? (
                            <div className="space-y-1">
                              {tenant.units.map((unit) => (
                                <div key={unit.id} className="text-sm font-semibold text-terracotta">
                                  ₦{unit.rent_amount.toLocaleString()}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-forest text-white">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {tenant.first_name} {tenant.last_name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteTenant(tenant.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Tenant
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Tenants;
