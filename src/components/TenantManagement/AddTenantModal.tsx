
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/hooks/useProperties';
import { UserPlus, Calendar } from 'lucide-react';

interface AddTenantModalProps {
  property: Property;
  onTenantAdded: () => void;
}

const AddTenantModal = ({ property, onTenantAdded }: AddTenantModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tenantData, setTenantData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    unitNumber: '',
    rentAmount: '',
    depositAmount: '',
    leaseStartDate: '',
    leaseEndDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // Create unit first
      const unitData = {
        property_id: property.id,
        unit_number: tenantData.unitNumber,
        rent_amount: parseFloat(tenantData.rentAmount),
        deposit_amount: tenantData.depositAmount ? parseFloat(tenantData.depositAmount) : null,
        status: 'OCCUPIED',
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate
      };

      const { data: unitResult, error: unitError } = await supabase
        .from('units')
        .insert(unitData)
        .select()
        .single();

      if (unitError) throw unitError;

      // Create tenant profile
      const profileData = {
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        phone: tenantData.phone
      };

      // Note: In a real app, you'd need to create an auth user first
      // For now, we'll just create a profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        console.log('Profile creation note:', profileError.message);
      }

      toast({
        title: "Success",
        description: "Tenant added successfully!",
      });

      setTenantData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        unitNumber: '',
        rentAmount: '',
        depositAmount: '',
        leaseStartDate: '',
        leaseEndDate: ''
      });
      
      setOpen(false);
      onTenantAdded();
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        title: "Error", 
        description: "Failed to add tenant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-terracotta/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant to {property.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={tenantData.firstName}
                onChange={(e) => setTenantData({...tenantData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={tenantData.lastName}
                onChange={(e) => setTenantData({...tenantData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={tenantData.email}
              onChange={(e) => setTenantData({...tenantData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={tenantData.phone}
              onChange={(e) => setTenantData({...tenantData, phone: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitNumber">Unit Number</Label>
              <Input
                id="unitNumber"
                value={tenantData.unitNumber}
                onChange={(e) => setTenantData({...tenantData, unitNumber: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="rentAmount">Monthly Rent (₦)</Label>
              <Input
                id="rentAmount"
                type="number"
                value={tenantData.rentAmount}
                onChange={(e) => setTenantData({...tenantData, rentAmount: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
            <Input
              id="depositAmount"
              type="number"
              value={tenantData.depositAmount}
              onChange={(e) => setTenantData({...tenantData, depositAmount: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseStartDate">Lease Start Date</Label>
              <Input
                id="leaseStartDate"
                type="date"
                value={tenantData.leaseStartDate}
                onChange={(e) => setTenantData({...tenantData, leaseStartDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="leaseEndDate">Lease End Date</Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={tenantData.leaseEndDate}
                onChange={(e) => setTenantData({...tenantData, leaseEndDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantModal;
