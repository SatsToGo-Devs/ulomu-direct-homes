
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import { Users } from 'lucide-react';
import CreateTenantModal from '@/components/TenantManagement/CreateTenantModal';
import TenantSearch from '@/components/TenantManagement/TenantSearch';
import TenantsByProperty from '@/components/TenantManagement/TenantsByProperty';
import UnassignedTenants from '@/components/TenantManagement/UnassignedTenants';
import AllTenantsList from '@/components/TenantManagement/AllTenantsList';

const Tenants = () => {
  const { tenants, loading: tenantsLoading, deleteTenant, fetchTenants } = useTenants();
  const { properties, loading: propertiesLoading } = useProperties();
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

  // Get unassigned tenants (tenants with no units)
  const unassignedTenants = tenants.filter(tenant => !tenant.units || tenant.units.length === 0);

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
              Manage all your tenants ({tenants.length} total, {unassignedTenants.length} unassigned)
            </CardDescription>
          </div>
          <CreateTenantModal />
        </div>

        <TenantSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
          properties={properties}
        />
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="by-property" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-property" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
              By Property
            </TabsTrigger>
            <TabsTrigger value="all-tenants" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
              All Tenants
            </TabsTrigger>
            <TabsTrigger value="unassigned" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
              Unassigned ({unassignedTenants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-property" className="space-y-6">
            <TenantsByProperty
              tenantsByProperty={tenantsByProperty}
              properties={properties}
              deleteTenant={deleteTenant}
              fetchTenants={fetchTenants}
            />
          </TabsContent>

          <TabsContent value="unassigned" className="space-y-6">
            <UnassignedTenants
              unassignedTenants={unassignedTenants}
              properties={properties}
              deleteTenant={deleteTenant}
              fetchTenants={fetchTenants}
            />
          </TabsContent>

          <TabsContent value="all-tenants" className="space-y-6">
            <AllTenantsList
              filteredTenants={filteredTenants}
              properties={properties}
              deleteTenant={deleteTenant}
              fetchTenants={fetchTenants}
              searchTerm={searchTerm}
              filterProperty={filterProperty}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Tenants;
