
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Home } from 'lucide-react';
import { Tenant } from '@/hooks/useTenants';
import { Property } from '@/hooks/useProperties';
import { useUnitAvailability } from './hooks/useUnitAvailability';
import { useTenantAssignment } from './hooks/useTenantAssignment';
import TenantAssignmentForm from './components/TenantAssignmentForm';

interface TenantUnitAssignmentProps {
  tenant: Tenant;
  properties: Property[];
  onAssignmentUpdated: () => void;
}

const TenantUnitAssignment: React.FC<TenantUnitAssignmentProps> = ({
  tenant,
  properties,
  onAssignmentUpdated
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  
  const { user } = useAuth();
  const { availableUnits, fetchAvailableUnits, setAvailableUnits } = useUnitAvailability(user?.id);
  const { loading, assignTenant } = useTenantAssignment();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedPropertyId('');
      setSelectedUnitId('');
      setAvailableUnits([]);
      setRentAmount('');
      setDepositAmount('');
      setLeaseStartDate('');
      setLeaseEndDate('');
    }
  }, [open, setAvailableUnits]);

  const handlePropertySelect = (propertyId: string) => {
    console.log('Property selected:', propertyId);
    setSelectedPropertyId(propertyId);
    setSelectedUnitId('');
    setRentAmount('');
    fetchAvailableUnits(propertyId);
  };

  const handleUnitSelect = (unitId: string) => {
    console.log('Unit selected:', unitId);
    setSelectedUnitId(unitId);
    const unit = availableUnits.find(u => u.id === unitId);
    if (unit) {
      setRentAmount(unit.rent_amount.toString());
    }
  };

  const handleAssignment = async () => {
    if (!user) return;

    const success = await assignTenant(
      tenant,
      selectedUnitId,
      rentAmount,
      depositAmount,
      leaseStartDate,
      leaseEndDate,
      user.id
    );

    if (success) {
      setOpen(false);
      onAssignmentUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-terracotta hover:bg-terracotta/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-terracotta" />
            Assign {tenant.first_name} {tenant.last_name} to Unit
          </DialogTitle>
        </DialogHeader>
        
        <TenantAssignmentForm
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          selectedUnitId={selectedUnitId}
          availableUnits={availableUnits}
          rentAmount={rentAmount}
          depositAmount={depositAmount}
          leaseStartDate={leaseStartDate}
          leaseEndDate={leaseEndDate}
          onPropertySelect={handlePropertySelect}
          onUnitSelect={handleUnitSelect}
          onRentAmountChange={setRentAmount}
          onDepositAmountChange={setDepositAmount}
          onLeaseStartDateChange={setLeaseStartDate}
          onLeaseEndDateChange={setLeaseEndDate}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignment} 
            disabled={loading || !selectedUnitId || !rentAmount}
            className="bg-forest hover:bg-forest/90"
          >
            {loading ? 'Assigning...' : 'Assign to Unit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUnitAssignment;
