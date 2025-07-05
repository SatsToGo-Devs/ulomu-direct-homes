
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Home } from 'lucide-react';

interface TenantUnitManagerProps {
  propertyId: string;
  propertyName: string;
  onTenantAdded: () => void;
}

const TenantUnitManager: React.FC<TenantUnitManagerProps> = ({
  propertyId,
  propertyName,
  onTenantAdded
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
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
    if (!user || !formData.firstName || !formData.lastName || !formData.email || !formData.unitNumber || !formData.rentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create tenant first
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Create unit with tenant assignment
      const { error: unitError } = await supabase
        .from('units')
        .insert({
          property_id: propertyId,
          unit_number: formData.unitNumber,
          rent_amount: parseFloat(formData.rentAmount),
          deposit_amount: formData.depositAmount ? parseFloat(formData.depositAmount) : null,
          status: 'OCCUPIED',
          lease_start_date: formData.leaseStartDate || null,
          lease_end_date: formData.leaseEndDate || null,
          tenant_id: tenant.id
        });

      if (unitError) throw unitError;

      toast({
        title: "Success",
        description: "Tenant and unit created successfully!",
      });

      // Reset form
      setFormData({
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
      console.error('Error creating tenant and unit:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant and unit",
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
          Add Tenant & Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-terracotta" />
            Add Tenant to {propertyName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber}
                onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                placeholder="e.g., 1A, 2B"
                required
              />
            </div>
            <div>
              <Label htmlFor="rentAmount">Monthly Rent (₦) *</Label>
              <Input
                id="rentAmount"
                type="number"
                value={formData.rentAmount}
                onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
            <Input
              id="depositAmount"
              type="number"
              value={formData.depositAmount}
              onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseStartDate">Lease Start Date</Label>
              <Input
                id="leaseStartDate"
                type="date"
                value={formData.leaseStartDate}
                onChange={(e) => setFormData({...formData, leaseStartDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="leaseEndDate">Lease End Date</Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={formData.leaseEndDate}
                onChange={(e) => setFormData({...formData, leaseEndDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Tenant & Unit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUnitManager;
