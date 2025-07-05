
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

  const resetForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tenants",
        variant: "destructive",
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.unitNumber || !formData.rentAmount) {
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

      if (tenantError) {
        console.error('Error creating tenant:', tenantError);
        throw tenantError;
      }

      // Create unit with tenant assignment
      const unitData = {
        property_id: propertyId,
        unit_number: formData.unitNumber,
        rent_amount: parseFloat(formData.rentAmount),
        deposit_amount: formData.depositAmount ? parseFloat(formData.depositAmount) : null,
        status: 'OCCUPIED',
        lease_start_date: formData.leaseStartDate || null,
        lease_end_date: formData.leaseEndDate || null,
        tenant_id: tenant.id
      };

      const { error: unitError } = await supabase
        .from('units')
        .insert(unitData);

      if (unitError) {
        console.error('Error creating unit:', unitError);
        
        // If unit creation fails, we should clean up the tenant
        await supabase
          .from('tenants')
          .delete()
          .eq('id', tenant.id);
          
        throw unitError;
      }

      toast({
        title: "Success",
        description: `Tenant ${formData.firstName} ${formData.lastName} and unit ${formData.unitNumber} created successfully!`,
      });

      resetForm();
      setOpen(false);
      onTenantAdded();
      
    } catch (error: any) {
      console.error('Error creating tenant and unit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tenant and unit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                type="text"
                value={formData.unitNumber}
                onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                placeholder="e.g., 1A, 2B, 101"
                required
              />
            </div>
            <div>
              <Label htmlFor="rentAmount">Monthly Rent (₦) *</Label>
              <Input
                id="rentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.rentAmount}
                onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                placeholder="Enter monthly rent"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
            <Input
              id="depositAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.depositAmount}
              onChange={(e) => handleInputChange('depositAmount', e.target.value)}
              placeholder="Enter security deposit (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseStartDate">Lease Start Date</Label>
              <Input
                id="leaseStartDate"
                type="date"
                value={formData.leaseStartDate}
                onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="leaseEndDate">Lease End Date</Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={formData.leaseEndDate}
                onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              {loading ? 'Creating...' : 'Create Tenant & Unit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUnitManager;
