import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Wrench,
  Zap,
  Shield,
  Building,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIPredictions = () => {
  const navigate = useNavigate();

  const predictions = [
    {
      id: 1,
      type: "Maintenance Alert",
      property: "Marina Heights",
      prediction: "HVAC system likely to fail within 10 days",
      confidence: 95,
      severity: "High",
      action: "Schedule immediate maintenance",
      icon: AlertTriangle,
      color: "text-red-500",
      savings: "₦450,000"
    },
    {
      id: 2,
      type: "Cost Optimization",
      property: "Lekki Phase 2",
      prediction: "Switch to LED lighting for 40% energy savings",
      confidence: 87,
      severity: "Medium",
      action: "Plan lighting upgrade",
      icon: Zap,
      color: "text-gold",
      savings: "₦120,000"
    },
    {
      id: 3,
      type: "Preventive Maintenance",
      property: "Victoria Island Office",
      prediction: "Generator service due in 5 days",
      confidence: 92,
      severity: "Medium",
      action: "Schedule routine service",
      icon: Wrench,
      color: "text-terracotta",
      savings: "₦75,000"
    },
    {
      id: 4,
      type: "Security Alert",
      property: "Surulere Complex",
      prediction: "Motion sensor battery low - replace within 3 days",
      confidence: 98,
      severity: "Low",
      action: "Replace batteries",
      icon: Shield,
      color: "text-forest",
      savings: "₦15,000"
    }
  ];

  const trends = [
    {
      metric: "Maintenance Costs",
      trend: "Decreasing 15%",
      period: "Last 3 months",
      icon: TrendingUp,
      color: "text-forest"
    },
    {
      metric: "Energy Efficiency",
      trend: "Improving 23%",
      period: "Last 6 months",
      icon: Zap,
      color: "text-gold"
    },
    {
      metric: "Response Time",
      trend: "Faster by 2.3 hours",
      period: "Last month",
      icon: Calendar,
      color: "text-terracotta"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">AI Predictions</h1>
          <p className="text-white/90">Predictive insights powered by artificial intelligence</p>
        </div>
      </div>
      
      <main className="flex-1 bg-beige/20 py-8">
        <div className="container mx-auto px-4">
          {/* Performance Trends */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {trends.map((trend, index) => (
              <Card key={index} className="border-beige/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{trend.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{trend.trend}</p>
                      <p className="text-xs text-gray-500">{trend.period}</p>
                    </div>
                    <trend.icon className={`h-8 w-8 ${trend.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Predictions */}
          <Card className="border-beige/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-terracotta" />
                Active Predictions & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <prediction.icon className={`h-5 w-5 mt-1 ${prediction.color}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{prediction.type}</h3>
                            <Badge 
                              variant={
                                prediction.severity === 'High' ? 'destructive' : 
                                prediction.severity === 'Medium' ? 'secondary' : 'outline'
                              }
                            >
                              {prediction.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{prediction.property}</p>
                          <p className="text-sm text-gray-700">{prediction.prediction}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Confidence</p>
                        <p className="text-lg font-bold text-terracotta">{prediction.confidence}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Recommended Action:</span>
                        <span className="font-medium">{prediction.action}</span>
                        <span className="text-forest font-semibold">Potential Savings: {prediction.savings}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Dismiss</Button>
                        <Button size="sm" className="bg-terracotta hover:bg-terracotta/90">Take Action</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-beige/50">
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
                  onClick={() => navigate('/dashboard')}
                >
                  <Brain className="h-6 w-6 mb-2" />
                  Dashboard
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AIPredictions;
