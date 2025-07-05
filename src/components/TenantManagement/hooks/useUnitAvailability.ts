
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Unit {
  id: string;
  unit_number: string;
  property_id: string;
  status: string;
  rent_amount: number;
}

export const useUnitAvailability = (userId: string | undefined) => {
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const { toast } = useToast();

  const fetchAvailableUnits = useCallback(async (propertyId: string) => {
    if (!userId || !propertyId) {
      setAvailableUnits([]);
      return;
    }

    try {
      console.log('Fetching available units for property:', propertyId);
      
      // Fetch all units for the selected property
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id, unit_number, property_id, status, rent_amount, tenant_id')
        .eq('property_id', propertyId)
        .order('unit_number');

      if (unitsError) {
        console.error('Error fetching units:', unitsError);
        throw unitsError;
      }

      console.log('Fetched all units:', units);

      // Get all tenants for this landlord to cross-reference
      const { data: allTenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', userId);

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        // Continue without tenant data for now
      }

      const tenantIds = allTenants?.map(t => t.id) || [];
      console.log('All tenant IDs for this landlord:', tenantIds);

      // Filter units that are truly available:
      // 1. No tenant_id assigned, OR
      // 2. tenant_id is assigned but that tenant doesn't exist in our tenants table
      const availableUnits = (units || []).filter(unit => {
        const hasNoTenant = !unit.tenant_id;
        const hasInvalidTenant = unit.tenant_id && !tenantIds.includes(unit.tenant_id);
        const isVacantStatus = unit.status === 'VACANT' || !unit.status;
        
        // Unit is available if it has no tenant OR has an invalid tenant reference
        // AND either has vacant status or no status set
        return (hasNoTenant || hasInvalidTenant) && isVacantStatus;
      });

      console.log('Filtered available units:', availableUnits);
      setAvailableUnits(availableUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available units",
        variant: "destructive",
      });
      setAvailableUnits([]);
    }
  }, [userId, toast]);

  return {
    availableUnits,
    fetchAvailableUnits,
    setAvailableUnits
  };
};
