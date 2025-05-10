
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  tenant: {
    name: string;
    email: string;
  };
}

interface MaintenanceManagerProps {
  propertyId?: string; // Optional: to filter by property
}

export default function MaintenanceManager({ propertyId }: MaintenanceManagerProps) {
  const { data: session } = useSession();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  
  const fetchMaintenanceRequests = async () => {
    try {
      const url = propertyId 
        ? `/api/landlord/maintenance?propertyId=${propertyId}` 
        : '/api/landlord/maintenance';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMaintenanceRequests(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast.error('Failed to load maintenance requests');
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, [propertyId]);

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/landlord/maintenance/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Maintenance request updated successfully');
        fetchMaintenanceRequests();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update maintenance request');
      }
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Low</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'HIGH':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'EMERGENCY':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Emergency</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {maintenanceRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.tenant.name}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No maintenance requests found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
