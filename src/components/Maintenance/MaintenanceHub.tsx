import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatAssistant from '@/components/AI/ChatAssistant';
import VendorManagement from '@/components/Vendor/VendorManagement';
import { useMaintenanceCoordination } from '@/hooks/useMaintenanceCoordination';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';
import { 
  Wrench, 
  Bot, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  MessageCircle,
  Camera,
  FileText,
  Coordination
} from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  created_at: string;
  properties: { name: string };
  units?: { unit_number: string };
  vendor_id?: string;
  vendors?: { name: string; rating: number };
}

interface MaintenancePrediction {
  id: string;
  title: string;
  description: string;
  predicted_date: string;
  confidence_score: number;
  estimated_cost: number;
  prevention_actions: string[];
}

const MaintenanceHub: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  
  // Enhanced with coordination and notifications
  const { coordinations, updateCoordinationStatus, addRealtimeUpdate } = useMaintenanceCoordination();
  const { notifications } = useSmartNotifications();

  useEffect(() => {
    if (user) {
      fetchMaintenanceData();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch maintenance requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('maintenance_requests') 
        .select(`
          *,
          properties(name),
          units(unit_number),
          vendors(name, rating)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      setRequests(requestsData || []);

      // Fetch AI predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('ai_predictions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('prediction_type', 'maintenance')
        .order('confidence_score', { ascending: false });

      if (predictionsError) throw predictionsError;
      setPredictions(predictionsData || []);

    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('maintenance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        () => {
          fetchMaintenanceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const generateAIPredictions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-predictions', {
        body: {
          userId: user?.id,
          propertyId: 'all',
          maintenanceHistory: requests
        }
      });

      if (error) throw error;

      toast({
        title: "AI Predictions Generated",
        description: `Generated ${data.predictions?.length || 0} maintenance predictions`
      });

      fetchMaintenanceData();
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({
        title: "Prediction Error",
        description: "Failed to generate AI predictions",
        variant: "destructive"
      });
    }
  };

  const createCoordination = async (requestId: string, priority: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_coordination')
        .insert({
          maintenance_request_id: requestId,
          coordinator_id: user?.id,
          priority_level: priority,
          status: 'PENDING'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Maintenance coordination created"
      });
    } catch (error) {
      console.error('Error creating coordination:', error);
      toast({
        title: "Error",
        description: "Failed to create coordination",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RequestCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => {
    const coordination = coordinations.find(c => c.maintenance_request_id === request.id);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={getStatusColor(request.status)}>
                {request.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            <p><strong>Property:</strong> {request.properties?.name}</p>
            {request.units && <p><strong>Unit:</strong> {request.units.unit_number}</p>}
            {request.category && <p><strong>Category:</strong> {request.category}</p>}
          </div>
          
          {request.description && (
            <p className="text-sm text-gray-700">{request.description}</p>
          )}

          {/* Coordination Status */}
          {coordination && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <div className="flex items-center gap-2 text-sm">
                <Coordination className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Coordination Status:</span>
                <Badge className={getStatusColor(coordination.status)}>
                  {coordination.status.replace('_', ' ')}
                </Badge>
              </div>
              {coordination.real_time_updates.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Latest: {coordination.real_time_updates[coordination.real_time_updates.length - 1]?.message}
                </p>
              )}
            </div>
          )}

          {request.vendors && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>Assigned to: {request.vendors.name}</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(request.vendors?.rating || 0) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t text-sm">
            <span className="text-gray-500">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
            {request.estimated_cost && (
              <span className="font-medium text-green-600">
                Est: ${request.estimated_cost.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <FileText className="h-3 w-3 mr-1" />
              Details
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
            {request.status === 'PENDING' && !coordination && (
              <Button 
                size="sm" 
                className="bg-terracotta hover:bg-terracotta/90"
                onClick={() => createCoordination(request.id, request.priority)}
              >
                Coordinate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const PredictionCard: React.FC<{ prediction: MaintenancePrediction }> = ({ prediction }) => (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{prediction.title}</CardTitle>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {Math.round(prediction.confidence_score * 100)}% Likely
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{prediction.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Predicted Date:</span>
            <p>{new Date(prediction.predicted_date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Est. Cost:</span>
            <p className="text-green-600 font-medium">
              ${prediction.estimated_cost.toLocaleString()}
            </p>
          </div>
        </div>

        {prediction.prevention_actions.length > 0 && (
          <div>
            <span className="font-medium text-gray-700 text-sm">Prevention Actions:</span>
            <ul className="mt-1 text-sm text-gray-600">
              {prediction.prevention_actions.slice(0, 2).map((action, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            Schedule Preventive
          </Button>
          <Button size="sm" className="bg-terracotta hover:bg-terracotta/90">
            Create Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    avgCost: requests.reduce((sum, r) => sum + (r.actual_cost || r.estimated_cost || 0), 0) / requests.length || 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading maintenance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-terracotta">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-forest">${Math.round(stats.avgCost).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Avg Cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced notification banner for urgent items */}
      {notifications.filter(n => n.priority === 'urgent' && !n.read).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                {notifications.filter(n => n.priority === 'urgent' && !n.read).length} urgent notifications requiring attention
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            AI Predictions
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Maintenance Requests</h3>
            <Button className="bg-terracotta hover:bg-terracotta/90">
              <Wrench className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>

          {requests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
                <p className="text-gray-600 mb-4">Create your first maintenance request to get started</p>
                <Button className="bg-terracotta hover:bg-terracotta/90">
                  Create Request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI-Powered Maintenance Predictions</h3>
            <Button onClick={generateAIPredictions} className="bg-terracotta hover:bg-terracotta/90">
              <Bot className="h-4 w-4 mr-2" />
              Generate Predictions
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {predictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>

          {predictions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions available</h3>
                <p className="text-gray-600 mb-4">Generate AI-powered maintenance predictions based on your property data</p>
                <Button onClick={generateAIPredictions} className="bg-terracotta hover:bg-terracotta/90">
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Predictions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vendors">
          <VendorManagement />
        </TabsContent>

        <TabsContent value="assistant">
          <ChatAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceHub;
