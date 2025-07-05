
import React, { useState } from 'react';
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

  const fetchAvailableUnits = async (propertyId: string) => {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', propertyId)
        .eq('status', 'VACANT');

      if (error) throw error;
      setAvailableUnits(units || []);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available units",
        variant: "destructive",
      });
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedUnitId('');
    fetchAvailableUnits(propertyId);
  };

  const handleUnitSelect = (unitId: string) => {
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

    try {
      setLoading(true);

      // Update the unit with tenant assignment
      const { error: unitError } = await supabase
        .from('units')
        .update({
          tenant_id: tenant.id,
          status: 'OCCUPIED',
          rent_amount: parseFloat(rentAmount),
          deposit_amount: depositAmount ? parseFloat(depositAmount) : null,
          lease_start_date: leaseStartDate || null,
          lease_end_date: leaseEndDate || null,
        })
        .eq('id', selectedUnitId);

      if (unitError) throw unitError;

      toast({
        title: "Success",
        description: "Tenant assigned to unit successfully!",
      });

      setOpen(false);
      onAssignmentUpdated();
      
      // Reset form
      setSelectedPropertyId('');
      setSelectedUnitId('');
      setRentAmount('');
      setDepositAmount('');
      setLeaseStartDate('');
      setLeaseEndDate('');
    } catch (error) {
      console.error('Error assigning tenant:', error);
      toast({
        title: "Error",
        description: "Failed to assign tenant to unit",
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
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentAmount">Monthly Rent (₦) *</Label>
              <Input
                id="rentAmount"
                type="number"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
              <Input
                id="depositAmount"
                type="number"
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
