
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Search, Mail, Phone, Trash2, UserPlus } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import CreateTenantModal from '@/components/TenantManagement/CreateTenantModal';
import ProtectedRoute from '@/components/ProtectedRoute';

const TenantsPage = () => {
  const { tenants, loading, deleteTenant } = useTenants();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
            <p className="text-white/90">Manage all your tenants</p>
          </div>
        </div>

        <main className="flex-1 bg-beige/20 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
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
                            {tenant.units && tenant.units.length > 0 && (
                              <Badge className="bg-forest text-white">
                                Active Tenant
                              </Badge>
                            )}
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
                                This will also remove them from any units they're currently occupying.
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
                    </CardContent>
                  </Card>
                ))}
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
