
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserMinus } from 'lucide-react';

interface RemoveTenantFromUnitProps {
  tenantId: string;
  unitId: string;
  tenantName: string;
  unitNumber: string;
  onRemovalComplete: () => void;
}

const RemoveTenantFromUnit: React.FC<RemoveTenantFromUnitProps> = ({
  tenantId,
  unitId,
  tenantName,
  unitNumber,
  onRemovalComplete
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRemoveTenant = async () => {
    try {
      setLoading(true);

      // Remove tenant from unit and set status to vacant
      const { error } = await supabase
        .from('units')
        .update({
          tenant_id: null,
          status: 'VACANT',
          lease_start_date: null,
          lease_end_date: null,
        })
        .eq('id', unitId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${tenantName} has been removed from Unit ${unitNumber}`,
      });

      onRemovalComplete();
    } catch (error) {
      console.error('Error removing tenant from unit:', error);
      toast({
        title: "Error",
        description: "Failed to remove tenant from unit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <UserMinus className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Tenant from Unit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {tenantName} from Unit {unitNumber}? 
            This will make the unit vacant and available for new assignments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRemoveTenant}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Removing...' : 'Remove Tenant'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTenantFromUnit;
