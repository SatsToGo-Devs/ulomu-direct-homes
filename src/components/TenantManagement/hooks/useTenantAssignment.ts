
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tenant } from '@/hooks/useTenants';

export const useTenantAssignment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const assignTenant = async (
    tenant: Tenant,
    selectedUnitId: string,
    rentAmount: string,
    depositAmount: string,
    leaseStartDate: string,
    leaseEndDate: string,
    userId: string
  ) => {
    if (!selectedUnitId || !rentAmount) {
      toast({
        title: "Error",
        description: "Please select a unit and enter rent amount",
        variant: "destructive",
      });
      return false;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to assign tenants",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      console.log('Assigning tenant to unit:', {
        tenantId: tenant.id,
        unitId: selectedUnitId,
        rentAmount,
        depositAmount
      });

      // Update the unit with tenant assignment
      const updateData: any = {
        tenant_id: tenant.id,
        status: 'OCCUPIED',
        rent_amount: parseFloat(rentAmount),
        updated_at: new Date().toISOString()
      };

      if (depositAmount) {
        updateData.deposit_amount = parseFloat(depositAmount);
      }

      if (leaseStartDate) {
        updateData.lease_start_date = leaseStartDate;
      }

      if (leaseEndDate) {
        updateData.lease_end_date = leaseEndDate;
      }

      const { error: unitError } = await supabase
        .from('units')
        .update(updateData)
        .eq('id', selectedUnitId);

      if (unitError) {
        console.error('Error updating unit:', unitError);
        throw unitError;
      }

      console.log('Successfully assigned tenant to unit');

      toast({
        title: "Success",
        description: `${tenant.first_name} ${tenant.last_name} has been assigned to the unit successfully!`,
      });

      return true;
    } catch (error: any) {
      console.error('Error assigning tenant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign tenant to unit",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    assignTenant
  };
};
