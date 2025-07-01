import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Search, Mail, Phone, Trash2, Building, Wrench } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import CreateTenantModal from '@/components/TenantManagement/CreateTenantModal';
import TenantServiceRequests from '@/components/TenantManagement/TenantServiceRequests';
import ProtectedRoute from '@/components/ProtectedRoute';

const TenantsPage = () => {
  const { tenants, loading: tenantsLoading, deleteTenant } = useTenants();
  const { properties, loading: propertiesLoading } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tenants by property
  const tenantsByProperty = properties.map(property => ({
    ...property,
    tenants: filteredTenants.filter(tenant => 
      tenant.units?.some(unit => unit.property_id === property.id)
    )
  }));

  if (tenantsLoading || propertiesLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 bg-beige/20 py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Tenant Management</h1>
            <p className="text-white/90">Manage all your tenants and their service requests</p>
          </div>
        </div>

        <main className="flex-1 bg-beige/20 py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="by-property" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="by-property">By Property</TabsTrigger>
                <TabsTrigger value="all-tenants">All Tenants</TabsTrigger>
                <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
              </TabsList>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <CreateTenantModal />
              </div>

              <TabsContent value="by-property" className="space-y-6">
                {tenantsByProperty.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
                      <p className="text-gray-500 mb-4">Add properties first to manage tenants</p>
                      <Button onClick={() => window.location.href = '/add-property'}>
                        Add Property
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  tenantsByProperty.map((property) => (
                    <Card key={property.id} className="border-beige/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Building className="h-6 w-6 text-terracotta" />
                            <div>
                              <CardTitle>{property.name}</CardTitle>
                              <p className="text-sm text-gray-600">{property.address}</p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {property.tenants.length} tenant{property.tenants.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {property.tenants.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No tenants in this property</p>
                            <CreateTenantModal />
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {property.tenants.map((tenant) => (
                              <div key={tenant.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-semibold">
                                        {tenant.first_name} {tenant.last_name}
                                      </h4>
                                      <Badge className="bg-forest text-white">Active</Badge>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {tenant.email}
                                      </div>
                                      {tenant.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4" />
                                          {tenant.phone}
                                        </div>
                                      )}
                                    </div>

                                    {tenant.units && tenant.units.map((unit) => (
                                      <div key={unit.id} className="bg-gray-50 p-2 rounded mb-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Unit {unit.unit_number}</span>
                                          <span className="text-forest font-semibold">
                                            ₦{unit.rent_amount.toLocaleString()}/month
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedTenant(tenant.id)}
                                    >
                                      <Wrench className="h-4 w-4 mr-1" />
                                      Requests
                                    </Button>
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
                                            Are you sure you want to delete {tenant.first_name} {tenant.last_name}?
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
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {searchTerm ? 'No tenants found' : 'No tenants yet'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Start by adding your first tenant'
                        }
                      </p>
                      {!searchTerm && <CreateTenantModal />}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {filteredTenants.map((tenant) => (
                      <Card key={tenant.id} className="border-beige/50">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold">
                                  {tenant.first_name} {tenant.last_name}
                                </h3>
                                <Badge className="bg-forest text-white">Active Tenant</Badge>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-terracotta" />
                                  <span className="text-sm">{tenant.email}</span>
                                </div>
                                {tenant.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-forest" />
                                    <span className="text-sm">{tenant.phone}</span>
                                  </div>
                                )}
                              </div>

                              {tenant.units && tenant.units.length > 0 && (
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">Current Units:</h4>
                                  <div className="space-y-2">
                                    {tenant.units.map((unit) => (
                                      <div key={unit.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <div>
                                          <span className="font-medium">Unit {unit.unit_number}</span>
                                          <span className="text-gray-500 ml-2">- {unit.properties.name}</span>
                                        </div>
                                        <span className="font-medium text-forest">
                                          ₦{unit.rent_amount.toLocaleString()}/month
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedTenant(tenant.id)}
                              >
                                <Wrench className="h-4 w-4 mr-1" />
                                View Requests
                              </Button>
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
                                      Are you sure you want to delete {tenant.first_name} {tenant.last_name}?
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="service-requests">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      All Service Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TenantServiceRequests />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Service Requests Modal */}
            {selectedTenant && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Service Requests</h2>
                      <Button variant="outline" onClick={() => setSelectedTenant(null)}>
                        Close
                      </Button>
                    </div>
                    <TenantServiceRequests tenantId={selectedTenant} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default TenantsPage;
