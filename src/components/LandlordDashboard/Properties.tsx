
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  location: string;
  status: string;
  tenant: string;
  rentDue: string;
  rentAmount: string;
}

interface PropertiesProps {
  properties: Property[];
}

const Properties = ({ properties }: PropertiesProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Properties</CardTitle>
          <Button>Add New Property</Button>
        </div>
        <CardDescription>Manage all your property listings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Next Rent Due</TableHead>
              <TableHead>Rent Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>
                  <Badge className={property.status === "Rented" ? "bg-forest" : "bg-blue-500"}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell>{property.tenant}</TableCell>
                <TableCell>{property.rentDue}</TableCell>
                <TableCell>{property.rentAmount}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Properties;
