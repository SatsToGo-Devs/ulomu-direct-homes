
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EscrowDashboard from "@/components/Escrow/EscrowDashboard";
import ServiceChargeOverview from "@/components/Escrow/ServiceChargeOverview";
import ServiceChargeManager from "@/components/Landlord/ServiceChargeManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  Wrench, 
  CreditCard, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Star
} from "lucide-react";

const EscrowHub = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "All payments are held securely until work is completed and approved"
    },
    {
      icon: Users,
      title: "Multi-Party Protection",
      description: "Protects landlords, tenants, and service providers in every transaction"
    },
    {
      icon: Wrench,
      title: "Service Tracking",
      description: "Track maintenance work progress and service charge utilization"
    },
    {
      icon: CheckCircle,
      title: "Automatic Release",
      description: "Funds released automatically when conditions are met or manually approved"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Payment Initiation",
      description: "Tenant pays service charges or landlord funds maintenance work"
    },
    {
      step: 2,
      title: "Escrow Hold",
      description: "Funds are securely held in escrow until work completion"
    },
    {
      step: 3,
      title: "Service Delivery",
      description: "Service provider completes the required work or service"
    },
    {
      step: 4,
      title: "Verification & Release",
      description: "Work is verified and funds are released to service provider"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Secure Escrow Payment System
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Transparent, secure payments for property maintenance and service charges. 
              Protecting landlords, tenants, and service providers.
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Bank-level Security
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Guaranteed Protection
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Instant Settlements
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-beige/20 py-12">
        <div className="container mx-auto px-4">
          {/* Features Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Ulomu Escrow?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our escrow system ensures fair and transparent transactions for all parties involved in property management.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-terracotta mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-terracotta text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {step.step}
                    </div>
                    {index < howItWorks.length - 1 && (
                      <ArrowRight className="h-6 w-6 text-gray-400 absolute top-3 -right-8 hidden md:block" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Dashboard */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Escrow Dashboard</TabsTrigger>
              <TabsTrigger value="service-overview">Service Charges</TabsTrigger>
              <TabsTrigger value="service-manager">Manage Charges</TabsTrigger>
              <TabsTrigger value="help">Help & Support</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <EscrowDashboard />
            </TabsContent>

            <TabsContent value="service-overview">
              <ServiceChargeOverview />
            </TabsContent>

            <TabsContent value="service-manager">
              <ServiceChargeManager unitId="demo-unit-id" />
            </TabsContent>

            <TabsContent value="help">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How secure are escrow payments?</h4>
                      <p className="text-sm text-gray-600">
                        All funds are held in secure, regulated escrow accounts with bank-level security 
                        and encryption. Funds are only released when conditions are met.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">When are funds released?</h4>
                      <p className="text-sm text-gray-600">
                        Funds are released when work is completed and verified, or when preset 
                        conditions are met. You can also manually release funds at any time.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">What happens if there's a dispute?</h4>
                      <p className="text-sm text-gray-600">
                        Our dispute resolution team reviews all evidence and makes fair decisions 
                        based on the terms agreed upon by all parties.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center mr-3">
                          <CreditCard className="h-5 w-5 text-terracotta" />
                        </div>
                        <div>
                          <p className="font-medium">Payment Issues</p>
                          <p className="text-sm text-gray-600">payments@ulomu.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-forest" />
                        </div>
                        <div>
                          <p className="font-medium">Security Concerns</p>
                          <p className="text-sm text-gray-600">security@ulomu.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium">General Support</p>
                          <p className="text-sm text-gray-600">support@ulomu.com</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Trust Indicators */}
          <div className="mt-12 bg-white rounded-xl p-8 text-center">
            <div className="flex justify-center items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-gold fill-current" />
              ))}
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted by 5,000+ Users</h3>
            <p className="text-gray-600 mb-4">
              "Ulomu's escrow system has completely transformed how we handle property maintenance payments. 
              Everything is transparent and secure."
            </p>
            <p className="text-sm text-gray-500">- Property Manager, Lagos</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EscrowHub;
