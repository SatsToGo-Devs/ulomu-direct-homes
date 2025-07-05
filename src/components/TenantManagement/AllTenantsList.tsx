
import React from 'react';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Mail, Phone, Calendar, Building, Trash2 } from 'lucide-react';
import { Tenant } from '@/hooks/useTenants';
import { Property } from '@/hooks/useProperties';
import TenantUnitAssignment from './TenantUnitAssignment';
import CreateTenantModal from './CreateTenantModal';

interface AllTenantsListProps {
  filteredTenants: Tenant[];
  properties: Property[];
  deleteTenant: (id: string) => Promise<void>;
  fetchTenants: () => void;
  searchTerm: string;
  filterProperty: string;
}

const AllTenantsList: React.FC<AllTenantsListProps> = ({
  filteredTenants,
  properties,
  deleteTenant,
  fetchTenants,
  searchTerm,
  filterProperty
}) => {
  if (filteredTenants.length === 0) {
    return (
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
    );
  }

  return (
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
                {tenant.units && tenant.units.length > 0 ? (
                  <Badge className="bg-forest text-white">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-ulomu-gold/20 text-ulomu-gold border-ulomu-gold/30">
                    Unassigned
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {(!tenant.units || tenant.units.length === 0) && (
                    <TenantUnitAssignment
                      tenant={tenant}
                      properties={properties}
                      onAssignmentUpdated={fetchTenants}
                    />
                  )}
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
  );
};

export default AllTenantsList;
