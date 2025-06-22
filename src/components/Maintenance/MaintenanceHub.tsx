
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMaintenanceData } from '@/hooks/useMaintenanceData';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { Wrench, AlertTriangle, Clock, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MaintenanceHub = () => {
  const { requests, loading: requestsLoading, createMaintenanceRequest } = useMaintenanceData();
  const { predictions, generateContent } = useAIPredictions();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS': return <Wrench className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gold text-white';
      case 'IN_PROGRESS': return 'bg-terracotta text-white';
      case 'COMPLETED': return 'bg-forest text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-gold text-white';
      case 'LOW': return 'bg-forest text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleGenerateRequest = async () => {
    try {
      const generatedContent = await generateContent(
        'Generate a maintenance request for HVAC system inspection',
        'REQUEST',
        { type: 'maintenance_request' }
      );

      await createMaintenanceRequest({
        title: 'AI-Generated: HVAC System Inspection',
        description: generatedContent.generated_content,
        priority: 'MEDIUM',
        category: 'HVAC'
      });

      toast({
        title: "AI Request Generated",
        description: "A maintenance request has been created using AI assistance.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate maintenance request.",
        variant: "destructive",
      });
    }
  };

  const maintenancePredictions = predictions.filter(p => p.prediction_type === 'MAINTENANCE');

  if (requestsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-forest">Maintenance Hub</h2>
          <p className="text-gray-600">Manage maintenance requests with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateRequest} className="bg-terracotta hover:bg-terracotta/90">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate Request
          </Button>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Active Requests</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Wrench className="h-4 w-4 text-terracotta" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-terracotta">{requests.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold">
                  {requests.filter(r => r.status === 'PENDING').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Wrench className="h-4 w-4 text-terracotta" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-terracotta">
                  {requests.filter(r => r.status === 'IN_PROGRESS').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-forest" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">
                  {requests.filter(r => r.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.properties?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.estimated_cost ? `₦${request.estimated_cost.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-gold" />
                AI Maintenance Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenancePredictions.map((prediction) => (
                  <div key={prediction.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{prediction.title}</h3>
                        <p className="text-gray-600">{prediction.description}</p>
                      </div>
                      <Badge className="bg-forest text-white">
                        {Math.round(prediction.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                    
                    {prediction.prevention_actions && prediction.prevention_actions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {prediction.prevention_actions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-600">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {prediction.estimated_cost && (
                      <div className="text-sm text-gray-600">
                        Estimated Cost: <span className="font-medium">₦{prediction.estimated_cost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Historical maintenance data and trends will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceHub;
