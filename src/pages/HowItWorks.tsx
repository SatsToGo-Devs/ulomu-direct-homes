
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Home, MessageCircle, Calendar, CheckCheck, FileCheck } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <User className="h-16 w-16 text-terracotta" />,
      title: "Create an Account",
      description: "Sign up as a tenant or landlord. Complete your profile with all necessary information to build trust with other users.",
      details: [
        "Choose your account type: Tenant or Landlord",
        "Add your personal information",
        "Upload a profile photo",
        "Verify your identity (required for landlords)"
      ]
    },
    {
      icon: <Home className="h-16 w-16 text-terracotta" />,
      title: "Browse or List Properties",
      description: "As a tenant, search for properties using our advanced filters. As a landlord, list your properties with detailed information and high-quality photos.",
      details: [
        "Search by location, price, property type, and more",
        "View high-quality photos and virtual tours",
        "Check property details and amenities",
        "Save favorites for later"
      ]
    },
    {
      icon: <MessageCircle className="h-16 w-16 text-terracotta" />,
      title: "Connect Directly",
      description: "Chat with landlords or tenants directly through our secure messaging system, without any intermediaries.",
      details: [
        "Ask questions about the property",
        "Negotiate terms directly",
        "Share additional documents if needed",
        "Get quick responses without agent delays"
      ]
    },
    {
      icon: <Calendar className="h-16 w-16 text-terracotta" />,
      title: "Schedule a Visit",
      description: "Book property viewings at times that work for both you and the landlord, all through the Ulomu platform.",
      details: [
        "Select from available viewing times",
        "Receive confirmation directly from the landlord",
        "Get reminders before your scheduled visit",
        "Reschedule if necessary with easy calendar management"
      ]
    },
    {
      icon: <CheckCheck className="h-16 w-16 text-terracotta" />,
      title: "Make Your Decision",
      description: "After viewing the property, decide if it meets your needs. If yes, proceed with the application process.",
      details: [
        "Review all property details again",
        "Consider location, amenities, and price",
        "Compare with other viewed properties",
        "Make an informed decision without pressure"
      ]
    },
    {
      icon: <FileCheck className="h-16 w-16 text-terracotta" />,
      title: "Complete the Process",
      description: "Finalize the agreement directly with the landlord, sign the necessary documents, and move into your new home.",
      details: [
        "Submit required documents",
        "Sign the rental agreement",
        "Pay the agreed amount directly to the landlord",
        "Schedule move-in date"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-beige py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Ulomu Works</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              We've simplified the rental process by removing unnecessary middlemen and enabling direct connections between property owners and tenants.
            </p>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-16 last:mb-0">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 bg-beige rounded-full p-4">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </span>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-lg text-gray-700 mb-4">{step.description}</p>
                      <ul className="bg-gray-50 p-4 rounded-md space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                              <CheckCheck size={12} />
                            </div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-beige">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Still have questions about how Ulomu works? Check out our most commonly asked questions below.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y">
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">Is Ulomu completely free for tenants?</h3>
                <p className="text-gray-700">
                  Yes! Tenants can use Ulomu to search for properties, contact landlords, and schedule viewings for free. 
                  There are no hidden fees or charges.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">How do you verify landlords?</h3>
                <p className="text-gray-700">
                  We verify landlords through a combination of document verification, property ownership proof, and identity checks. 
                  Verified landlords receive a special badge on their profile.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">What if I have issues with a landlord?</h3>
                <p className="text-gray-700">
                  We have a dispute resolution system in place. You can report any issues through our platform, 
                  and our team will investigate and help mediate the situation.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">How do I pay rent through Ulomu?</h3>
                <p className="text-gray-700">
                  Ulomu facilitates direct connections between landlords and tenants, but rent payments are handled directly between parties. 
                  We recommend using secure payment methods and getting proper receipts.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-terracotta text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians who are already enjoying a better rental experience without agent fees.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-terracotta hover:bg-gray-100">
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-terracotta/90">
                <Link to="/signup">Create an Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
