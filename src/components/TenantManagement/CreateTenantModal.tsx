
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';

const CreateTenantModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createTenant } = useTenants();
  const { properties } = useProperties();
  
  const [tenantData, setTenantData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyId: '',
    unitNumber: '',
  });

  // Get available units from selected property
  const availableUnits = properties
    .find(p => p.id === tenantData.propertyId)
    ?.units_count || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantData.firstName || !tenantData.lastName || !tenantData.email) return;

    try {
      setLoading(true);
      await createTenant({
        firstName: tenantData.firstName,
        lastName: tenantData.lastName,
        email: tenantData.email,
        phone: tenantData.phone,
      });

      setTenantData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyId: '',
        unitNumber: '',
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-terracotta/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
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

export default CreateTenantModal;
