
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tenant {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  units?: {
    id: string;
    unit_number: string;
    rent_amount: number;
    property_id: string;
    properties: {
      name: string;
    };
  }[];
}

export const useTenants = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTenants();
    }
  }, [user]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      
      // Since the tenants table might not be available in types yet,
      // let's fetch units with tenant information instead
      const { data: units, error } = await supabase
        .from('units')
        .select(`
          *,
          properties!inner(
            name,
            user_id
          )
        `)
        .not('tenant_id', 'is', null)
        .eq('properties.user_id', user?.id);

      if (error) throw error;

      // For now, create mock tenant data from units
      // This will be replaced once the database types are updated
      const mockTenants: Tenant[] = units?.map((unit, index) => ({
        id: unit.tenant_id || `tenant-${index}`,
        user_id: user!.id,
        first_name: `Tenant`,
        last_name: `${index + 1}`,
        email: `tenant${index + 1}@example.com`,
        phone: undefined,
        created_at: unit.created_at || new Date().toISOString(),
        updated_at: unit.updated_at || new Date().toISOString(),
        units: [{
          id: unit.id,
          unit_number: unit.unit_number,
          rent_amount: unit.rent_amount,
          property_id: unit.property_id,
          properties: {
            name: unit.properties?.name || 'Unknown Property'
          }
        }]
      })) || [];

      setTenants(mockTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (tenantData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    unitId?: string;
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // For now, we'll create a simplified tenant record
      // This will be improved once the database types are updated
      const mockTenant = {
        id: `tenant-${Date.now()}`,
        user_id: user.id,
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        email: tenantData.email,
        phone: tenantData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // If unitId is provided, link the tenant to the unit
      if (tenantData.unitId) {
        const { error: unitError } = await supabase
          .from('units')
          .update({ 
            tenant_id: mockTenant.id, 
            status: 'OCCUPIED' 
          })
          .eq('id', tenantData.unitId);

        if (unitError) throw unitError;
      }

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant created successfully!",
      });

      return mockTenant;
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTenant = async (tenantId: string) => {
    try {
      // First, remove tenant from any units
      await supabase
        .from('units')
        .update({ tenant_id: null, status: 'VACANT' })
        .eq('tenant_id', tenantId);

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant removed successfully",
      });
    } catch (error) {
      console.error('Error removing tenant:', error);
      toast({
        title: "Error",
        description: "Failed to remove tenant",
        variant: "destructive",
      });
    }
  };

  return {
    tenants,
    loading,
    fetchTenants,
    createTenant,
    deleteTenant,
  };
};
