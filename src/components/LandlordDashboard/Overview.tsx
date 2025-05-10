
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface OverviewProps {
  properties: {
    id: string;
    title: string;
    status: string;
  }[];
  payments: {
    id: string;
    amount: string;
  }[];
}

const Overview = ({ properties, payments }: OverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{properties.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Rented Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{properties.filter(p => p.status === "Rented").length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₦{payments.reduce((acc, payment) => acc + parseInt(payment.amount.replace('₦', '').replace(',', '')), 0).toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
