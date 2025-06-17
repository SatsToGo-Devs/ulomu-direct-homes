
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, Calendar, TrendingUp, Wrench, Users } from "lucide-react";

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Predictive Maintenance",
      description: "AI analyzes property data to predict maintenance needs before issues occur, saving time and money.",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: MessageSquare,
      title: "AI Tenant Chatbot",
      description: "24/7 intelligent chatbot handles tenant requests, triages issues, and provides instant responses.",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automatically schedules maintenance, coordinates with vendors, and manages technician availability.",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: TrendingUp,
      title: "Cost Optimization",
      description: "AI insights help reduce maintenance costs by optimizing schedules and preventing major repairs.",
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: Wrench,
      title: "Vendor Management",
      description: "Intelligent matching with vetted contractors, performance tracking, and automated dispatching.",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Users,
      title: "Multi-Property Dashboard",
      description: "Centralized control for multiple properties with AI-powered insights and recommendations.",
      color: "text-indigo-600 bg-indigo-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Property Maintenance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge artificial intelligence to transform how you maintain 
            and manage your properties. Reduce costs, prevent issues, and keep tenants happy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
