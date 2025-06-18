
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const ServiceChargeOverview = () => {
  const serviceCharges = [
    {
      id: '1',
      property: 'Marina Heights Apartment',
      unit: 'Unit 3B',
      description: 'Monthly Service Charge',
      amount: 45000,
      escrowHeld: 45000,
      status: 'PAID',
      dueDate: '2024-01-15',
      tenant: 'John Adebayo'
    },
    {
      id: '2',
      property: 'Lekki Phase 2 Complex',
      unit: 'Unit 12A',
      description: 'Quarterly Service Charge',
      amount: 120000,
      escrowHeld: 120000,
      status: 'PAID',
      dueDate: '2024-01-01',
      tenant: 'Sarah Okafor'
    },
    {
      id: '3',
      property: 'Victoria Island Office',
      unit: 'Suite 205',
      description: 'Monthly Service Charge',
      amount: 85000,
      escrowHeld: 0,
      status: 'PENDING',
      dueDate: '2024-01-20',
      tenant: 'Mike Johnson'
    },
    {
      id: '4',
      property: 'Ikeja Duplex',
      unit: 'Unit A',
      description: 'Bi-annual Service Charge',
      amount: 180000,
      escrowHeld: 90000,
      status: 'PARTIAL',
      dueDate: '2024-01-10',
      tenant: 'Grace Nwosu'
    }
  ];

  const paymentHistory = [
    {
      id: '1',
      date: '2024-01-15',
      tenant: 'John Adebayo',
      amount: 45000,
      purpose: 'Security Services',
      status: 'RELEASED',
      vendor: 'SecureGuard Ltd'
    },
    {
      id: '2',
      date: '2024-01-12',
      tenant: 'Sarah Okafor',
      amount: 35000,
      purpose: 'Cleaning Services',
      status: 'RELEASED',
      vendor: 'CleanPro Services'
    },
    {
      id: '3',
      date: '2024-01-10',
      tenant: 'Grace Nwosu',
      amount: 25000,
      purpose: 'Landscaping',
      status: 'HELD',
      vendor: 'GreenSpace Gardens'
    },
    {
      id: '4',
      date: '2024-01-08',
      tenant: 'John Adebayo',
      amount: 15000,
      purpose: 'Waste Management',
      status: 'RELEASED',
      vendor: 'EcoWaste Solutions'
    },
    {
      id: '5',
      date: '2024-01-05',
      tenant: 'Sarah Okafor',
      amount: 55000,
      purpose: 'Generator Maintenance',
      status: 'RELEASED',
      vendor: 'PowerTech Services'
    }
  ];

  const totalCollected = serviceCharges.reduce((sum, charge) => 
    charge.status === 'PAID' ? sum + charge.amount : sum, 0
  );
  
  const totalInEscrow = serviceCharges.reduce((sum, charge) => sum + charge.escrowHeld, 0);
  
  const totalReleased = paymentHistory
    .filter(payment => payment.status === 'RELEASED')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-forest text-white';
      case 'PENDING': return 'bg-gold text-white';
      case 'PARTIAL': return 'bg-terracotta text-white';
      case 'RELEASED': return 'bg-forest text-white';
      case 'HELD': return 'bg-terracotta text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">
              ₦{totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
            <Clock className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terracotta">
              ₦{totalInEscrow.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Awaiting release</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Released to Vendors</CardTitle>
            <CheckCircle className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">
              ₦{totalReleased.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transparency Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">98%</div>
            <p className="text-xs text-gray-600">Fund utilization tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Charges Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-terracotta" />
            Service Charges Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Escrow Held</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceCharges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell className="font-medium">{charge.property}</TableCell>
                  <TableCell>{charge.unit}</TableCell>
                  <TableCell>{charge.tenant}</TableCell>
                  <TableCell>₦{charge.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-terracotta">
                    ₦{charge.escrowHeld.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(charge.status)}>
                      {charge.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{charge.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-forest" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.tenant}</TableCell>
                  <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.purpose}</TableCell>
                  <TableCell className="font-medium">{payment.vendor}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeOverview;
