
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, Bell, Wrench } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Connect Your Properties",
      description: "Add your properties and integrate with existing systems. Ulomu learns about your assets and maintenance history.",
      step: "01"
    },
    {
      icon: Brain,
      title: "AI Analysis & Prediction",
      description: "Our AI analyzes property data, weather patterns, and usage to predict maintenance needs and optimize schedules.",
      step: "02"
    },
    {
      icon: Bell,
      title: "Smart Alerts & Scheduling",
      description: "Receive intelligent alerts about upcoming maintenance needs and automatically schedule with trusted vendors.",
      step: "03"
    },
    {
      icon: Wrench,
      title: "Seamless Execution",
      description: "Vendors complete work with photo documentation. Track progress and costs through your centralized dashboard.",
      step: "04"
    }
  ];

  return (
    <section className="py-20 bg-beige/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Ulomu Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, intelligent, and automated. Transform your property maintenance 
            in four easy steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                  <step.icon className="h-8 w-8 text-terracotta" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
