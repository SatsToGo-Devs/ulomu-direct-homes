
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, Brain, Bell, Wrench, CheckCircle, ArrowRight } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <Upload className="h-16 w-16 text-terracotta" />,
      title: "Connect Your Properties",
      description: "Add your properties and integrate with existing systems. Ulomu learns about your assets and maintenance history to provide intelligent recommendations.",
      details: [
        "Upload property details and photos",
        "Connect existing maintenance records",
        "Set up tenant information",
        "Install IoT sensors (optional)"
      ]
    },
    {
      icon: <Brain className="h-16 w-16 text-terracotta" />,
      title: "AI Analysis & Prediction",
      description: "Our AI analyzes property data, weather patterns, usage history, and tenant feedback to predict maintenance needs before issues occur.",
      details: [
        "Predictive maintenance alerts",
        "Weather-based recommendations",
        "Usage pattern analysis",
        "Cost optimization suggestions"
      ]
    },
    {
      icon: <Bell className="h-16 w-16 text-terracotta" />,
      title: "Smart Alerts & Scheduling",
      description: "Receive intelligent alerts about upcoming maintenance needs and automatically schedule with your trusted vendor network.",
      details: [
        "Automated maintenance scheduling",
        "Vendor matching and booking",
        "Tenant notification system",
        "Priority-based task management"
      ]
    },
    {
      icon: <Wrench className="h-16 w-16 text-terracotta" />,
      title: "Seamless Execution",
      description: "Vendors complete work with photo documentation and real-time updates. Track progress and costs through your centralized dashboard.",
      details: [
        "Real-time progress tracking",
        "Photo documentation",
        "Quality assurance checks",
        "Automated invoicing and payments"
      ]
    }
  ];

  const benefits = [
    "Reduce maintenance costs by up to 35%",
    "Prevent 90% of emergency repairs",
    "Increase tenant satisfaction by 40%",
    "Save 15+ hours per week on maintenance management"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-beige to-beige/50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How Ulomu <span className="text-terracotta">Transforms</span> Property Maintenance
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              From reactive repairs to predictive maintenance - discover how AI-powered property management 
              can revolutionize your business and keep your properties in perfect condition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-forest text-forest hover:bg-forest hover:text-white">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Intelligent, Automated
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your property maintenance in four easy steps
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-20 last:mb-0">
                  <div className={`flex flex-col lg:flex-row gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-xl mr-4">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">{step.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-forest mr-3" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-beige rounded-2xl flex items-center justify-center shadow-lg">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 bg-beige/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Proven Results for Property Owners
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of property owners who have transformed their maintenance operations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-beige/50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-6 w-6 text-forest" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-terracotta to-terracotta/90 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Property Maintenance?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Start your free 14-day trial today and experience the future of property management
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-terracotta hover:bg-beige hover:text-terracotta" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-terracotta">
                Schedule a Demo
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              No credit card required • Set up in under 5 minutes
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
