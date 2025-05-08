
import { MessageCircle, User, Calendar, Home } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="h-10 w-10 text-terracotta" />,
      title: "Create an Account",
      description: "Sign up as a tenant or landlord and complete your profile to get started.",
    },
    {
      icon: <Home className="h-10 w-10 text-terracotta" />,
      title: "Browse Properties",
      description: "Search for properties using filters like location, price, and amenities.",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-terracotta" />,
      title: "Connect Directly",
      description: "Chat with landlords directly to ask questions and negotiate terms.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-terracotta" />,
      title: "Schedule a Visit",
      description: "Book property viewings at times that work for both you and the landlord.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Ulomu Works</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We've streamlined the process of finding and renting a property by removing unnecessary 
            middlemen and connecting you directly with property owners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-beige rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
