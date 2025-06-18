
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  Home, 
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";

const TenantPortal = () => {
  const tenants = [
    {
      id: 1,
      name: "John Adebayo",
      unit: "3B",
      property: "Marina Heights",
      rentAmount: 500000,
      rentStatus: "Paid",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      email: "john.adebayo@email.com",
      phone: "+234 901 234 5678"
    },
    {
      id: 2,
      name: "Sarah Okafor",
      unit: "12A",
      property: "Lekki Phase 2",
      rentAmount: 750000,
      rentStatus: "Due",
      leaseStart: "2023-06-01",
      leaseEnd: "2024-05-31",
      email: "sarah.okafor@email.com",
      phone: "+234 802 345 6789"
    },
    {
      id: 3,
      name: "Mike Johnson",
      unit: "Unit A",
      property: "Ikeja Duplex",
      rentAmount: 650000,
      rentStatus: "Paid",
      leaseStart: "2024-03-01",
      leaseEnd: "2025-02-28",
      email: "mike.johnson@email.com",
      phone: "+234 703 456 7890"
    }
  ];

  const recentMessages = [
    {
      tenant: "John Adebayo",
      message: "Requesting maintenance for AC unit",
      time: "2 hours ago",
      status: "unread"
    },
    {
      tenant: "Sarah Okafor",
      message: "Thank you for the quick plumbing fix",
      time: "1 day ago",
      status: "read"
    },
    {
      tenant: "Mike Johnson",
      message: "Inquiry about lease renewal",
      time: "3 days ago",
      status: "read"
    }
  ];

  const paymentHistory = [
    {
      tenant: "John Adebayo",
      amount: 500000,
      date: "2024-01-15",
      status: "Completed",
      type: "Monthly Rent"
    },
    {
      tenant: "Sarah Okafor",
      amount: 750000,
      date: "2024-01-10",
      status: "Pending",
      type: "Monthly Rent"
    },
    {
      tenant: "Mike Johnson",
      amount: 650000,
      date: "2024-01-12",
      status: "Completed",
      type: "Monthly Rent"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Tenant Portal</h1>
          <p className="text-white/90">Manage your tenant relationships efficiently</p>
        </div>
      </div>
      
      <main className="flex-1 bg-beige/20 py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="tenants" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tenants">Tenant Directory</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
              <TabsTrigger value="leases">Lease Management</TabsTrigger>
            </TabsList>

            <TabsContent value="tenants" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tenant Directory</h2>
                <Button className="bg-terracotta hover:bg-terracotta/90">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Tenant
                </Button>
              </div>

              <div className="grid gap-4">
                {tenants.map((tenant) => (
                  <Card key={tenant.id} className="border-beige/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{tenant.name}</h3>
                            <Badge 
                              variant={tenant.rentStatus === 'Paid' ? 'default' : 'destructive'}
                              className={tenant.rentStatus === 'Paid' ? 'bg-forest' : ''}
                            >
                              {tenant.rentStatus}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Unit:</span>
                              <p className="font-medium">{tenant.unit} - {tenant.property}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Monthly Rent:</span>
                              <p className="font-medium">₦{tenant.rentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <p className="font-medium">{tenant.email}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <p className="font-medium">{tenant.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Recent Messages</h2>
                <Button className="bg-gold hover:bg-gold/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>

              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <Card key={index} className="border-beige/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            message.status === 'unread' ? 'bg-terracotta' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="font-medium">{message.tenant}</p>
                            <p className="text-sm text-gray-600">{message.message}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Payment Tracking</h2>
                <Button className="bg-forest hover:bg-forest/90">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>

              <div className="space-y-4">
                {paymentHistory.map((payment, index) => (
                  <Card key={index} className="border-beige/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <DollarSign className="h-5 w-5 text-gold" />
                          <div>
                            <p className="font-medium">{payment.tenant}</p>
                            <p className="text-sm text-gray-600">{payment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₦{payment.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{payment.date}</span>
                            <Badge 
                              variant={payment.status === 'Completed' ? 'default' : 'secondary'}
                              className={payment.status === 'Completed' ? 'bg-forest' : ''}
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leases" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lease Management</h2>
                <Button className="bg-terracotta hover:bg-terracotta/90">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Lease
                </Button>
              </div>

              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <Card key={tenant.id} className="border-beige/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{tenant.name}</h3>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Property:</span>
                              <p className="font-medium">{tenant.unit} - {tenant.property}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Lease Start:</span>
                              <p className="font-medium">{new Date(tenant.leaseStart).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Lease End:</span>
                              <p className="font-medium">{new Date(tenant.leaseEnd).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Lease</Button>
                          <Button variant="outline" size="sm">Renew</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TenantPortal;
