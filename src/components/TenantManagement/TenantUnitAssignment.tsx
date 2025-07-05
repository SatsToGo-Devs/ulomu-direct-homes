
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Home } from 'lucide-react';
import { Tenant } from '@/hooks/useTenants';
import { Property } from '@/hooks/useProperties';

interface TenantUnitAssignmentProps {
  tenant: Tenant;
  properties: Property[];
  onAssignmentUpdated: () => void;
}

interface Unit {
  id: string;
  unit_number: string;
  property_id: string;
  status: string;
  rent_amount: number;
}

const TenantUnitAssignment: React.FC<TenantUnitAssignmentProps> = ({
  tenant,
  properties,
  onAssignmentUpdated
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

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
  }, [open]);

  const fetchAvailableUnits = async (propertyId: string) => {
    if (!user || !propertyId) {
      setAvailableUnits([]);
      return;
    }

    try {
      console.log('Fetching available units for property:', propertyId);
      
      // Fetch all units for the selected property that are vacant or have no tenant assigned
      const { data: units, error } = await supabase
        .from('units')
        .select('id, unit_number, property_id, status, rent_amount, tenant_id')
        .eq('property_id', propertyId)
        .or('status.eq.VACANT,tenant_id.is.null')
        .order('unit_number');

      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }

      console.log('Fetched units:', units);
      
      // Filter out units that already have tenants assigned
      const vacantUnits = (units || []).filter(unit => 
        !unit.tenant_id && (unit.status === 'VACANT' || !unit.status)
      );

      console.log('Available vacant units:', vacantUnits);
      setAvailableUnits(vacantUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available units",
        variant: "destructive",
      });
      setAvailableUnits([]);
    }
  };

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
    if (!selectedUnitId || !rentAmount) {
      toast({
        title: "Error",
        description: "Please select a unit and enter rent amount",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to assign tenants",
        variant: "destructive",
      });
      return;
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

      setOpen(false);
      onAssignmentUpdated();
      
    } catch (error: any) {
      console.error('Error assigning tenant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign tenant to unit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="property">Select Property *</Label>
            <Select value={selectedPropertyId} onValueChange={handlePropertySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPropertyId && (
            <div>
              <Label htmlFor="unit">Select Available Unit *</Label>
              <Select value={selectedUnitId} onValueChange={handleUnitSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.length === 0 ? (
                    <SelectItem value="none" disabled>No vacant units available</SelectItem>
                  ) : (
                    availableUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        Unit {unit.unit_number} - ₦{unit.rent_amount.toLocaleString()}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedPropertyId && availableUnits.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No vacant units found for this property. All units may already be occupied.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentAmount">Monthly Rent (₦) *</Label>
              <Input
                id="rentAmount"
                type="number"
                min="0"
                step="0.01"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
              <Input
                id="depositAmount"
                type="number"
                min="0"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseStart">Lease Start Date</Label>
              <Input
                id="leaseStart"
                type="date"
                value={leaseStartDate}
                onChange={(e) => setLeaseStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="leaseEnd">Lease End Date</Label>
              <Input
                id="leaseEnd"
                type="date"
                value={leaseEndDate}
                onChange={(e) => setLeaseEndDate(e.target.value)}
              />
            </div>
          </div>

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUnitAssignment;
