
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ServiceCharge {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  nextDueDate: string;
}

interface ServiceChargeManagerProps {
  unitId: string;
}

export default function ServiceChargeManager({ unitId }: ServiceChargeManagerProps) {
  const { data: session } = useSession();
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [newCharge, setNewCharge] = useState({
    description: '',
    amount: '',
    frequency: 'MONTHLY',
    nextDueDate: new Date().toISOString().split('T')[0]
  });

  const fetchServiceCharges = async () => {
    try {
      const response = await fetch(`/api/landlord/service-charges?unitId=${unitId}`);
      if (response.ok) {
        const data = await response.json();
        setServiceCharges(data);
      }
    } catch (error) {
      console.error('Error fetching service charges:', error);
      toast.error('Failed to load service charges');
    }
  };

  useEffect(() => {
    if (unitId) {
      fetchServiceCharges();
    }
  }, [unitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCharge.description || !newCharge.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/landlord/service-charges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          description: newCharge.description,
          amount: parseFloat(newCharge.amount),
          frequency: newCharge.frequency,
          nextDueDate: new Date(newCharge.nextDueDate).toISOString()
        })
      });

      if (response.ok) {
        toast.success('Service charge added successfully');
        setNewCharge({
          description: '',
          amount: '',
          frequency: 'MONTHLY',
          nextDueDate: new Date().toISOString().split('T')[0]
        });
        fetchServiceCharges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add service charge');
      }
    } catch (error) {
      console.error('Error adding service charge:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const deleteServiceCharge = async (id: string) => {
    try {
      const response = await fetch(`/api/landlord/service-charges/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Service charge deleted successfully');
        fetchServiceCharges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete service charge');
      }
    } catch (error) {
      console.error('Error deleting service charge:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Charges</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={newCharge.description}
                onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                placeholder="e.g., Security Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                value={newCharge.amount}
                onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <Select
                value={newCharge.frequency}
                onValueChange={(value) => setNewCharge({ ...newCharge, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Next Due Date</label>
              <Input
                type="date"
                value={newCharge.nextDueDate}
                onChange={(e) => setNewCharge({ ...newCharge, nextDueDate: e.target.value })}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Add Service Charge</Button>
        </form>
        
        {serviceCharges.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceCharges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>${charge.amount.toFixed(2)}</TableCell>
                  <TableCell>{charge.frequency.charAt(0) + charge.frequency.slice(1).toLowerCase()}</TableCell>
                  <TableCell>{new Date(charge.nextDueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteServiceCharge(charge.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No service charges added yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
