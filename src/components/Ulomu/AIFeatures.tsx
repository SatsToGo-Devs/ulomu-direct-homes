
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Shield, TrendingUp, Clock, Users } from "lucide-react";

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Predictive Maintenance",
      description: "AI analyzes patterns to predict equipment failures before they happen, reducing costly emergency repairs.",
      color: "bg-terracotta/10 text-terracotta"
    },
    {
      icon: Zap,
      title: "Automated Scheduling",
      description: "Smart scheduling automatically books maintenance with the best available vendors at optimal times.",
      color: "bg-gold/10 text-gold"
    },
    {
      icon: Shield,
      title: "Secure Escrow Payments",
      description: "Protected payment system ensures funds are only released when maintenance work is completed satisfactorily.",
      color: "bg-forest/10 text-forest"
    },
    {
      icon: TrendingUp,
      title: "Cost Optimization",
      description: "Machine learning identifies opportunities to reduce maintenance costs while improving property performance.",
      color: "bg-terracotta/10 text-terracotta"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "24/7 monitoring of property systems with instant alerts for any issues requiring attention.",
      color: "bg-gold/10 text-gold"
    },
    {
      icon: Users,
      title: "Tenant Communication",
      description: "Automated tenant notifications and transparent communication about maintenance activities and costs.",
      color: "bg-forest/10 text-forest"
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
            Revolutionary artificial intelligence transforms how you manage properties, 
            reducing costs, preventing problems, and keeping tenants happy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
