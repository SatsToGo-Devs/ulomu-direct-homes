
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Shield, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ServiceCharge {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  nextDueDate: string;
  status: string;
  escrowHeld: number;
  payments: ServiceChargePayment[];
}

interface ServiceChargePayment {
  id: string;
  amount: number;
  paymentDate: string;
  status: string;
  escrowReleased: boolean;
}

interface ServiceChargeManagerProps {
  unitId: string;
}

export default function ServiceChargeManager({ unitId }: ServiceChargeManagerProps) {
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [newCharge, setNewCharge] = useState({
    description: '',
    amount: '',
    frequency: 'MONTHLY',
    nextDueDate: new Date().toISOString().split('T')[0],
    escrowPercentage: '100'
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
          nextDueDate: new Date(newCharge.nextDueDate).toISOString(),
          escrowPercentage: parseFloat(newCharge.escrowPercentage)
        })
      });

      if (response.ok) {
        toast.success('Service charge added successfully');
        setNewCharge({
          description: '',
          amount: '',
          frequency: 'MONTHLY',
          nextDueDate: new Date().toISOString().split('T')[0],
          escrowPercentage: '100'
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

  const releaseEscrowFunds = async (chargeId: string, paymentId: string) => {
    try {
      const response = await fetch(`/api/landlord/service-charges/${chargeId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });

      if (response.ok) {
        toast.success('Escrow funds released successfully');
        fetchServiceCharges();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to release funds');
      }
    } catch (error) {
      console.error('Error releasing funds:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const getTotalEscrowHeld = () => {
    return serviceCharges.reduce((total, charge) => total + charge.escrowHeld, 0);
  };

  const getTotalCollected = () => {
    return serviceCharges.reduce((total, charge) => 
      total + charge.payments.reduce((paymentTotal, payment) => 
        paymentTotal + (payment.status === 'COMPLETED' ? payment.amount : 0), 0
      ), 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terracotta">
              ₦{getTotalCollected().toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Held in Escrow</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₦{getTotalEscrowHeld().toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Charges</CardTitle>
            <Users className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">
              {serviceCharges.filter(charge => charge.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charges">Service Charges</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="add-charge">Add New Charge</TabsTrigger>
        </TabsList>

        <TabsContent value="charges">
          <Card>
            <CardHeader>
              <CardTitle>Service Charges Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {serviceCharges.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Escrow Held</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceCharges.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="font-medium">{charge.description}</TableCell>
                        <TableCell>₦{charge.amount.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{charge.frequency.toLowerCase()}</TableCell>
                        <TableCell className="text-blue-600 font-medium">
                          ₦{charge.escrowHeld.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={charge.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {charge.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(charge.nextDueDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No service charges added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History & Escrow Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceCharges.map((charge) => (
                  <div key={charge.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{charge.description}</h4>
                    {charge.payments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Escrow Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {charge.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                              <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={payment.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {payment.escrowReleased ? (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Released
                                  </div>
                                ) : (
                                  <div className="flex items-center text-blue-600">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Held
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {!payment.escrowReleased && payment.status === 'COMPLETED' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => releaseEscrowFunds(charge.id, payment.id)}
                                    className="bg-terracotta hover:bg-terracotta/90"
                                  >
                                    Release Funds
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 text-sm">No payments received yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-charge">
          <Card>
            <CardHeader>
              <CardTitle>Add New Service Charge</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      value={newCharge.description}
                      onChange={(e) => setNewCharge({ ...newCharge, description: e.target.value })}
                      placeholder="e.g., Security Services, Cleaning, Generator Maintenance"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                    <Input
                      type="number"
                      value={newCharge.amount}
                      onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
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
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Escrow Percentage</label>
                    <Input
                      type="number"
                      value={newCharge.escrowPercentage}
                      onChange={(e) => setNewCharge({ ...newCharge, escrowPercentage: e.target.value })}
                      placeholder="100"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Escrow Protection</h4>
                  <p className="text-sm text-blue-700">
                    {newCharge.escrowPercentage}% of payments will be held in escrow until you confirm 
                    the service has been completed satisfactorily. This ensures transparency and 
                    accountability for service providers.
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90">
                  Add Service Charge
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
