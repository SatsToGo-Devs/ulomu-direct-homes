
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, Wrench, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  estimated_cost: number;
  actual_cost: number;
  created_at: string;
  scheduled_date: string;
  completed_date: string;
  properties: {
    name: string;
  };
  units: {
    unit_number: string;
  };
  vendor?: {
    name: string;
    company_name: string;
  };
}

interface TenantServiceRequestsProps {
  tenantId?: string;
}

const TenantServiceRequests = ({ tenantId }: TenantServiceRequestsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceRequests();
  }, [user, tenantId]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(name),
          units(unit_number),
          vendors(name, company_name)
        `)
        .order('created_at', { ascending: false });

      // If tenantId is provided, filter by specific tenant, otherwise show current user's requests
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else if (user) {
        query = query.eq('tenant_id', user.id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Wrench className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Service Requests</h3>
        <Badge variant="outline">
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No service requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="border-beige/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      {request.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {request.properties?.name} - Unit {request.units?.unit_number}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{request.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {request.scheduled_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Scheduled: {new Date(request.scheduled_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {request.completed_date && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Completed: {new Date(request.completed_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {request.estimated_cost && (
                      <p><strong>Estimated Cost:</strong> ₦{request.estimated_cost.toLocaleString()}</p>
                    )}
                    
                    {request.actual_cost && (
                      <p><strong>Actual Cost:</strong> ₦{request.actual_cost.toLocaleString()}</p>
                    )}
                    
                    {request.vendor && (
                      <p><strong>Assigned to:</strong> {request.vendor.name} ({request.vendor.company_name})</p>
                    )}
                  </div>
                </div>
                
                {request.status === 'PENDING' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      Contact Support
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantServiceRequests;
