
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/hooks/useProperties';

interface Payment {
  id: string;
  propertyId: string;
  tenant: string;
  amount: string;
  date: string;
  status: string;
}

interface PaymentsProps {
  payments: Payment[];
  properties: Property[];
}

const Payments = ({ payments, properties }: PaymentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Track all payments from your tenants</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.tenant}</TableCell>
                <TableCell>{properties.find(p => p.id === payment.propertyId)?.name}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">{payment.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Generate Invoice</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Payments;
