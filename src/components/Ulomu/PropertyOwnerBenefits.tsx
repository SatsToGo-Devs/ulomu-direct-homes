
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Users, TrendingUp } from "lucide-react";

const PropertyOwnerBenefits = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Reduce Maintenance Costs",
      description: "Save up to 40% on maintenance costs through predictive maintenance and vendor optimization.",
      stat: "40% Cost Reduction",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Save Time & Effort",
      description: "Automate 80% of maintenance coordination tasks. Focus on growing your portfolio, not managing repairs.",
      stat: "80% Time Savings",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Happier Tenants",
      description: "Faster response times and proactive maintenance keep tenants satisfied and reduce turnover.",
      stat: "95% Satisfaction",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Increase Property Value",
      description: "Well-maintained properties appreciate faster and command higher rents in the market.",
      stat: "15% Higher ROI",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Benefits for Property Owners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of property owners who have transformed their maintenance 
            operations with Ulomu's AI-powered platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                </div>
                <div className={`text-2xl font-bold ${benefit.color} mb-2`}>
                  {benefit.stat}
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyOwnerBenefits;
