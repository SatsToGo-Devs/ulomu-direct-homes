
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Calendar,
  DollarSign,
  BarChart3,
  Target
} from "lucide-react";

const AIInsights = () => {
  const predictiveAlerts = [
    {
      property: "Marina Heights Apartment",
      equipment: "HVAC System",
      prediction: "Likely to fail within 7-10 days",
      confidence: "89%",
      action: "Schedule immediate inspection",
      severity: "High",
      potentialCost: "₦450,000"
    },
    {
      property: "Lekki Phase 2 Complex",
      equipment: "Water Pump",
      prediction: "Performance degradation detected",
      confidence: "76%",
      action: "Schedule maintenance in 2 weeks",
      severity: "Medium",
      potentialCost: "₦85,000"
    },
    {
      property: "Victoria Island Office",
      equipment: "Generator",
      prediction: "Oil change required soon",
      confidence: "95%",
      action: "Schedule routine maintenance",
      severity: "Low",
      potentialCost: "₦25,000"
    }
  ];

  const costOptimizations = [
    {
      title: "LED Lighting Upgrade",
      description: "Switch to LED lighting across 8 properties",
      savings: "₦180,000 annually",
      payback: "14 months",
      impact: "High"
    },
    {
      title: "Bulk Maintenance Scheduling",
      description: "Combine plumbing repairs in Surulere area",
      savings: "₦65,000 per quarter",
      payback: "Immediate",
      impact: "Medium"
    },
    {
      title: "Smart Thermostat Installation",
      description: "Install programmable thermostats in office buildings",
      savings: "₦95,000 annually",
      payback: "8 months",
      impact: "Medium"
    }
  ];

  const performanceMetrics = [
    {
      metric: "Predictive Accuracy",
      value: "92%",
      trend: "+5%",
      icon: Target,
      color: "text-green-600"
    },
    {
      metric: "Cost Savings",
      value: "₦2.4M",
      trend: "+12%",
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      metric: "Issues Prevented",
      value: "47",
      trend: "+23%",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      metric: "Response Time",
      value: "3.2 hrs",
      trend: "-18%",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
          <p className="text-blue-100">Powered by machine learning and predictive analytics</p>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                      <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                      <p className={`text-sm ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend} from last month
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="predictions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Predictive Alerts</TabsTrigger>
              <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
              <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Predictive Maintenance Alerts</h2>
                <Button>
                  <Brain className="h-4 w-4 mr-2" />
                  Run New Analysis
                </Button>
              </div>

              <div className="grid gap-4">
                {predictiveAlerts.map((alert, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{alert.property}</h3>
                          <p className="text-gray-600">{alert.equipment}</p>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === 'High' ? 'destructive' : 
                            alert.severity === 'Medium' ? 'secondary' : 'outline'
                          }
                        >
                          {alert.severity} Priority
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 text-sm">AI Prediction:</span>
                          <p className="font-medium">{alert.prediction}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Confidence Level:</span>
                          <p className="font-medium text-green-600">{alert.confidence}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Potential Cost:</span>
                          <p className="font-medium text-red-600">{alert.potentialCost}</p>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Recommended Action:</span>
                        </div>
                        <p className="text-yellow-700 mt-1">{alert.action}</p>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Dismiss</Button>
                        <Button size="sm">Schedule Maintenance</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cost Optimization Recommendations</h2>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              <div className="grid gap-6">
                {costOptimizations.map((optimization, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{optimization.title}</h3>
                          <p className="text-gray-600">{optimization.description}</p>
                        </div>
                        <Badge variant="outline">{optimization.impact} Impact</Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Potential Savings</span>
                          </div>
                          <p className="text-green-700 text-xl font-bold mt-1">{optimization.savings}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800">Payback Period</span>
                          </div>
                          <p className="text-blue-700 text-xl font-bold mt-1">{optimization.payback}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Learn More</Button>
                        <Button size="sm">Implement</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Chart visualization would go here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Cost breakdown chart would go here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIInsights;
