
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      color: "text-forest"
    },
    {
      metric: "Cost Savings",
      value: "₦2.4M",
      trend: "+12%",
      icon: DollarSign,
      color: "text-terracotta"
    },
    {
      metric: "Issues Prevented",
      value: "47",
      trend: "+23%",
      icon: AlertTriangle,
      color: "text-gold"
    },
    {
      metric: "Response Time",
      value: "3.2 hrs",
      trend: "-18%",
      icon: BarChart3,
      color: "text-forest"
    }
  ];

  // Chart data for maintenance trends
  const maintenanceTrends = [
    { month: 'Jan', preventive: 12, reactive: 8, cost: 450000 },
    { month: 'Feb', preventive: 15, reactive: 6, cost: 320000 },
    { month: 'Mar', preventive: 18, reactive: 4, cost: 280000 },
    { month: 'Apr', preventive: 22, reactive: 3, cost: 220000 },
    { month: 'May', preventive: 25, reactive: 2, cost: 180000 },
    { month: 'Jun', preventive: 28, reactive: 2, cost: 150000 }
  ];

  // Chart data for cost breakdown
  const costBreakdown = [
    { name: 'HVAC Maintenance', value: 35, color: '#C45B39' },
    { name: 'Plumbing', value: 20, color: '#2C5530' },
    { name: 'Electrical', value: 15, color: '#D4A64A' },
    { name: 'Landscaping', value: 12, color: '#F5F0E6' },
    { name: 'Security Systems', value: 10, color: '#8B4513' },
    { name: 'Other', value: 8, color: '#A0522D' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-br from-terracotta to-terracotta/90 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
          <p className="text-white/90">Powered by machine learning and predictive analytics</p>
        </div>
      </div>
      
      <main className="flex-1 bg-beige/20 py-8">
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
                      <p className={`text-sm ${metric.trend.startsWith('+') ? 'text-forest' : 'text-terracotta'}`}>
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
                <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  Run New Analysis
                </Button>
              </div>

              <div className="grid gap-4">
                {predictiveAlerts.map((alert, index) => (
                  <Card key={index} className="border-l-4 border-l-terracotta">
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
                          <p className="font-medium text-forest">{alert.confidence}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Potential Cost:</span>
                          <p className="font-medium text-terracotta">{alert.potentialCost}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-gold" />
                          <span className="font-medium text-gold">Recommended Action:</span>
                        </div>
                        <p className="text-gray-700 mt-1">{alert.action}</p>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Dismiss</Button>
                        <Button size="sm" className="bg-terracotta hover:bg-terracotta/90 text-white">Schedule Maintenance</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cost Optimization Recommendations</h2>
                <Button className="bg-forest hover:bg-forest/90 text-white">
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
                        <div className="bg-forest/10 border border-forest/30 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-forest" />
                            <span className="font-medium text-forest">Potential Savings</span>
                          </div>
                          <p className="text-forest text-xl font-bold mt-1">{optimization.savings}</p>
                        </div>
                        <div className="bg-terracotta/10 border border-terracotta/30 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-terracotta" />
                            <span className="font-medium text-terracotta">Payback Period</span>
                          </div>
                          <p className="text-terracotta text-xl font-bold mt-1">{optimization.payback}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Learn More</Button>
                        <Button size="sm" className="bg-terracotta hover:bg-terracotta/90 text-white">Implement</Button>
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
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-terracotta" />
                      Maintenance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={maintenanceTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="preventive" 
                            stroke="#2C5530" 
                            strokeWidth={2}
                            name="Preventive Maintenance"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="reactive" 
                            stroke="#C45B39" 
                            strokeWidth={2}
                            name="Reactive Maintenance"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-terracotta" />
                      Cost Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdown}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {costBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
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
