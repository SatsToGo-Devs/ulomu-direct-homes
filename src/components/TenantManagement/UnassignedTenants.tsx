
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { Tenant } from '@/hooks/useTenants';
import { Property } from '@/hooks/useProperties';
import TenantUnitAssignment from './TenantUnitAssignment';

interface UnassignedTenantsProps {
  unassignedTenants: Tenant[];
  properties: Property[];
  deleteTenant: (id: string) => Promise<void>;
  fetchTenants: () => void;
}

const UnassignedTenants: React.FC<UnassignedTenantsProps> = ({
  unassignedTenants,
  properties,
  deleteTenant,
  fetchTenants
}) => {
  if (unassignedTenants.length === 0) {
    return (
      <div className="text-center py-12 bg-ulomu-beige rounded-lg">
        <Users className="h-16 w-16 text-forest mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-forest mb-2">No unassigned tenants</h3>
        <p className="text-gray-600">All tenants are currently assigned to units</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-ulomu-gold/10 border border-ulomu-gold/30 rounded-lg p-4">
        <h3 className="font-semibold text-ulomu-gold mb-2">Unassigned Tenants</h3>
        <p className="text-sm text-gray-600">These tenants are not currently assigned to any units. Use the "Assign Unit" button to assign them to available units.</p>
      </div>
      
      {unassignedTenants.map((tenant) => (
        <Card key={tenant.id} className="border-ulomu-beige-dark">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-forest">
                    {tenant.first_name} {tenant.last_name}
                  </h4>
                  <Badge variant="outline" className="bg-ulomu-gold/20 text-ulomu-gold border-ulomu-gold/30">
                    Unassigned
                  </Badge>
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
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Added {new Date(tenant.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <TenantUnitAssignment
                  tenant={tenant}
                  properties={properties}
                  onAssignmentUpdated={fetchTenants}
                />
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UnassignedTenants;
