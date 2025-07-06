
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMaintenanceCoordination } from '@/hooks/useMaintenanceCoordination';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  ArrowRight
} from 'lucide-react';

const MaintenanceCoordinationWidget: React.FC = () => {
  const { coordinations, loading, updateCoordinationStatus } = useMaintenanceCoordination();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Real-time Coordination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeCoordinations = coordinations.filter(c => 
    c.status !== 'COMPLETED' && c.status !== 'CANCELLED'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Real-time Coordination
          {activeCoordinations.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {activeCoordinations.length} Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeCoordinations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No active coordination needed</p>
          </div>
        ) : (
          activeCoordinations.slice(0, 4).map((coordination) => (
            <div key={coordination.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(coordination.priority_level)}
                  <div>
                    <h4 className="font-medium text-sm">
                      {coordination.maintenance_requests?.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {coordination.maintenance_requests?.properties?.name}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(coordination.status)}>
                  {coordination.status.replace('_', ' ')}
                </Badge>
              </div>

              {coordination.vendors && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>Assigned to: {coordination.vendors.name}</span>
                </div>
              )}

              {coordination.estimated_duration && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>Est. Duration: {coordination.estimated_duration}</span>
                </div>
              )}

              {coordination.real_time_updates.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-1">Latest Update:</p>
                  <p className="text-xs text-gray-600">
                    {coordination.real_time_updates[coordination.real_time_updates.length - 1]?.message}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {coordination.status === 'PENDING' && (
                  <Button
                    size="sm"
                    onClick={() => updateCoordinationStatus(coordination.id, 'ASSIGNED')}
                    className="bg-terracotta hover:bg-terracotta/90 flex-1"
                  >
                    Assign Vendor
                  </Button>
                )}
                {coordination.status === 'ASSIGNED' && (
                  <Button
                    size="sm"
                    onClick={() => updateCoordinationStatus(coordination.id, 'IN_PROGRESS')}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    Start Work
                  </Button>
                )}
                {coordination.status === 'IN_PROGRESS' && (
                  <Button
                    size="sm"
                    onClick={() => updateCoordinationStatus(coordination.id, 'COMPLETED')}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceCoordinationWidget;
