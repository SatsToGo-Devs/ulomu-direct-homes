
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Calendar, 
  AlertTriangle, 
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatDistanceToNow } from "date-fns";

const UlomuDashboard = () => {
  const navigate = useNavigate();
  const { stats, maintenanceRequests, aiInsights, loading } = useDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties.toString(),
      icon: Building,
      color: "text-terracotta"
    },
    {
      title: "Active Tenants",
      value: stats.activeTenants.toString(),
      icon: Users,
      color: "text-forest"
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: "text-gold"
    },
    {
      title: "Cost Savings",
      value: `${stats.costSavings}%`,
      icon: TrendingUp,
      color: "text-terracotta"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-beige/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Insights */}
        <Card className="border-beige/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-terracotta" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No insights available yet.</p>
                <p className="text-sm">We're analyzing your data to generate insights.</p>
              </div>
            ) : (
              <>
                {aiInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-beige/30 rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      insight.priority === 'HIGH' ? 'text-red-500' : 
                      insight.priority === 'MEDIUM' ? 'text-orange-500' : 'text-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-700">{insight.insight_type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600 mt-1">{insight.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.round(insight.confidence_score * 100)}% confidence
                        </Badge>
                        {insight.estimated_savings && (
                          <span className="text-xs text-green-600 font-medium">
                            Save {formatCurrency(insight.estimated_savings)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  className="w-full mt-4 bg-terracotta hover:bg-terracotta/90 text-white"
                  onClick={() => navigate('/ai-insights')}
                >
                  View All Insights
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card className="border-beige/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gold" />
              Recent Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No maintenance requests yet.</p>
                </div>
              ) : (
                maintenanceRequests.map((request) => (
                  <div key={request.id} className="border-l-4 border-terracotta pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{request.property_name}</h4>
                      <Badge 
                        variant={
                          request.status === 'COMPLETED' ? 'default' : 
                          request.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                        }
                        className={
                          request.status === 'COMPLETED' ? 'bg-forest text-white' :
                          request.status === 'IN_PROGRESS' ? 'bg-gold text-white' : ''
                        }
                      >
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{request.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Tenant: {request.tenant_name}</span>
                      <span className={`px-2 py-1 rounded ${
                        request.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                        request.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {request.priority} Priority
                      </span>
                      <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-forest text-forest hover:bg-forest hover:text-white"
              onClick={() => navigate('/maintenance')}
            >
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 border-beige/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex-col bg-terracotta hover:bg-terracotta/90 text-white"
              onClick={() => navigate('/maintenance')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Maintenance
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-forest text-forest hover:bg-forest hover:text-white"
              onClick={() => navigate('/ai-insights')}
            >
              <Brain className="h-6 w-6 mb-2" />
              AI Insights
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-gold text-gold hover:bg-gold hover:text-white"
              onClick={() => navigate('/add-property')}
            >
              <Building className="h-6 w-6 mb-2" />
              Add Property
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
              onClick={() => navigate('/tenant-portal')}
            >
              <Users className="h-6 w-6 mb-2" />
              Tenant Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UlomuDashboard;
