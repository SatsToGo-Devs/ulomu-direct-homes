
import { Badge } from "@/components/ui/badge";
import { CheckCheck, DollarSign, Shield, Clock } from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-10 w-10 text-forest" />,
      title: "No Agent Fees",
      description: "Connect directly with landlords and avoid paying hefty agent commissions and viewing fees."
    },
    {
      icon: <Shield className="h-10 w-10 text-forest" />,
      title: "Verified Landlords",
      description: "All property owners on our platform are verified to ensure safety and legitimacy."
    },
    {
      icon: <CheckCheck className="h-10 w-10 text-forest" />,
      title: "Transparent Listings",
      description: "What you see is what you get - accurate descriptions and real photos of all properties."
    },
    {
      icon: <Clock className="h-10 w-10 text-forest" />,
      title: "Save Time",
      description: "Virtual tours and detailed information help you shortlist properties without physical visits."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-forest text-white">WHY CHOOSE ULOMU</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Smarter Way to Rent in Nigeria
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We're transforming the rental experience by removing intermediaries and creating 
            a direct connection between tenants and property owners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-beige rounded-full mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
