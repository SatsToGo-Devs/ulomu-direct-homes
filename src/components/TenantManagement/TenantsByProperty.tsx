
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building, Users, Mail, Phone, Home, MapPin, Trash2 } from 'lucide-react';
import { Property } from '@/hooks/useProperties';
import { Tenant } from '@/hooks/useTenants';
import PropertyOccupancy from './PropertyOccupancy';
import TenantUnitManager from './TenantUnitManager';
import RemoveTenantFromUnit from './RemoveTenantFromUnit';

interface TenantsByPropertyProps {
  tenantsByProperty: Array<Property & { 
    tenants: Tenant[]; 
    occupiedUnits: number; 
    totalUnits: number;
  }>;
  properties: Property[];
  deleteTenant: (id: string) => Promise<void>;
  fetchTenants: () => void;
}

const TenantsByProperty: React.FC<TenantsByPropertyProps> = ({
  tenantsByProperty,
  properties,
  deleteTenant,
  fetchTenants
}) => {
  if (properties.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {tenantsByProperty.map((property) => (
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
                              <div className="flex items-center gap-2">
                                <span className="text-terracotta font-semibold">
                                  ₦{unit.rent_amount.toLocaleString()}/month
                                </span>
                                <RemoveTenantFromUnit
                                  tenantId={tenant.id}
                                  unitId={unit.id}
                                  tenantName={`${tenant.first_name} ${tenant.last_name}`}
                                  unitNumber={unit.unit_number}
                                  onRemovalComplete={fetchTenants}
                                />
                              </div>
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
      ))}
    </div>
  );
};

export default TenantsByProperty;
