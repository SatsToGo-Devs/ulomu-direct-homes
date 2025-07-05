
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
      console.log('Fetching tenants for user:', user?.id);
      
      // Fetch tenants created by this landlord
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .eq('user_id', user?.id);

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }

      console.log('Fetched tenants:', tenantsData);

      // For each tenant, fetch their associated units
      const tenantsWithUnits = await Promise.all(
        (tenantsData || []).map(async (tenant) => {
          const { data: units, error: unitsError } = await supabase
            .from('units')
            .select(`
              id,
              unit_number,
              rent_amount,
              property_id,
              properties!inner(
                name,
                user_id
              )
            `)
            .eq('tenant_id', tenant.id)
            .eq('properties.user_id', user?.id);

          if (unitsError) {
            console.error('Error fetching units for tenant:', unitsError);
            return { ...tenant, units: [] };
          }

          return {
            ...tenant,
            units: units?.map(unit => ({
              id: unit.id,
              unit_number: unit.unit_number,
              rent_amount: unit.rent_amount,
              property_id: unit.property_id,
              properties: {
                name: unit.properties?.name || 'Unknown Property'
              }
            })) || []
          };
        })
      );

      setTenants(tenantsWithUnits);
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
  }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      console.log('Creating tenant with data:', tenantData);

      // Validate required fields
      if (!tenantData.firstName || !tenantData.lastName || !tenantData.email) {
        throw new Error('First name, last name, and email are required');
      }

      // Create tenant in the tenants table
      const { data: newTenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: user.id,
          first_name: tenantData.firstName,
          last_name: tenantData.lastName,
          email: tenantData.email,
          phone: tenantData.phone || null,
        })
        .select()
        .single();

      if (tenantError) {
        console.error('Error creating tenant:', tenantError);
        throw tenantError;
      }

      console.log('Created tenant:', newTenant);

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant created successfully!",
      });

      return newTenant;
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

      // Then delete the tenant record
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId)
        .eq('user_id', user?.id);

      if (error) throw error;

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
