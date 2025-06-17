
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench,
  TrendingUp,
  Building,
  Users,
  DollarSign
} from "lucide-react";

const UlomuDashboard = () => {
  const stats = [
    {
      title: "Total Properties",
      value: "24",
      icon: Building,
      color: "text-blue-600"
    },
    {
      title: "Active Tenants",
      value: "87",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "₦2.4M",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Cost Savings",
      value: "35%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const maintenanceRequests = [
    {
      id: 1,
      property: "Lekki Phase 1 Apartment",
      issue: "Air conditioning not cooling",
      priority: "High",
      status: "In Progress",
      tenant: "John Adebayo"
    },
    {
      id: 2,
      property: "Victoria Island Office",
      issue: "Plumbing leak in bathroom",
      priority: "Medium",
      status: "Scheduled",
      tenant: "Sarah Okafor"
    },
    {
      id: 3,
      property: "Ikeja Duplex",
      issue: "Electrical socket not working",
      priority: "Low",
      status: "Completed",
      tenant: "Mike Johnson"
    }
  ];

  const aiInsights = [
    {
      type: "Predictive Alert",
      message: "HVAC system at Marina Heights likely to fail within 10 days. Schedule maintenance now.",
      icon: AlertTriangle,
      color: "text-red-500"
    },
    {
      type: "Cost Optimization",
      message: "Switch to LED lighting across 5 properties to save ₦120,000 annually.",
      icon: Brain,
      color: "text-blue-500"
    },
    {
      type: "Scheduling Recommendation",
      message: "Bundle 3 plumbing repairs in Surulere area for 40% cost reduction.",
      icon: Calendar,
      color: "text-green-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div>
                  <p className="font-medium text-sm text-gray-700">{insight.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-4">View All Insights</Button>
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-600" />
              Recent Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="border-l-4 border-blue-500 pl-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{request.property}</h4>
                    <Badge 
                      variant={
                        request.status === 'Completed' ? 'default' : 
                        request.status === 'In Progress' ? 'secondary' : 'outline'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.issue}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Tenant: {request.tenant}</span>
                    <span className={`px-2 py-1 rounded ${
                      request.priority === 'High' ? 'bg-red-100 text-red-600' :
                      request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {request.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Requests</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Brain className="h-6 w-6 mb-2" />
              AI Predictions
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Building className="h-6 w-6 mb-2" />
              Add Property
            </Button>
            <Button variant="outline" className="h-20 flex-col">
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
