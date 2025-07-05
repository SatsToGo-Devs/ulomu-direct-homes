
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Property } from '@/hooks/useProperties';

interface OverviewProps {
  properties: Property[];
  payments: {
    id: string;
    amount: string;
  }[];
}

const Overview = ({ properties, payments }: OverviewProps) => {
  // Calculate rented properties based on units_count and actual occupancy
  const totalUnits = properties.reduce((sum, property) => sum + (property.units_count || 1), 0);
  const occupiedUnits = 0; // This would need to be calculated from actual tenant data
  
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
          <CardTitle>Total Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalUnits}</p>
          <p className="text-sm text-gray-500">{occupiedUnits} occupied</p>
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
