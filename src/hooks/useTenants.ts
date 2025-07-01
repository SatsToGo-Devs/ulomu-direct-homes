
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
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          units!units_tenant_id_fkey(
            id,
            unit_number,
            rent_amount,
            property_id,
            properties(name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
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

      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: user.id,
          first_name: tenantData.firstName,
          last_name: tenantData.lastName,
          email: tenantData.email,
          phone: tenantData.phone,
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // If unitId is provided, link the tenant to the unit
      if (tenantData.unitId) {
        const { error: unitError } = await supabase
          .from('units')
          .update({ tenant_id: tenant.id, status: 'OCCUPIED' })
          .eq('id', tenantData.unitId);

        if (unitError) throw unitError;
      }

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant created successfully!",
      });

      return tenant;
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

      // Then delete the tenant
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Error",
        description: "Failed to delete tenant",
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
