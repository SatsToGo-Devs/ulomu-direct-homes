import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, MessageSquare, CreditCard, FileText, Users, Settings } from "lucide-react";

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");

  // Mock data for the dashboard
  const properties = [
    {
      id: "1",
      title: "Modern 2-Bedroom Apartment",
      location: "Lekki Phase 1, Lagos",
      status: "Rented",
      tenant: "John Doe",
      rentDue: "2023-12-01",
      rentAmount: "₦1,500,000",
    },
    {
      id: "2",
      title: "Spacious 3-Bedroom Duplex",
      location: "Ikoyi, Lagos",
      status: "Available",
      tenant: "-",
      rentDue: "-",
      rentAmount: "₦6,000,000",
    },
  ];

  const payments = [
    {
      id: "pay1",
      propertyId: "1",
      tenant: "John Doe",
      amount: "₦1,500,000",
      date: "2023-06-01",
      status: "Completed",
    },
    {
      id: "pay2",
      propertyId: "1",
      tenant: "John Doe",
      amount: "₦1,500,000",
      date: "2022-06-01",
      status: "Completed",
    },
  ];

  const messages = [
    {
      id: "msg1",
      from: "John Doe",
      subject: "Regarding Water Supply Issue",
      date: "2023-11-15",
      read: true,
    },
    {
      id: "msg2",
      from: "Jane Smith",
      subject: "Interested in 3-Bedroom Duplex",
      date: "2023-11-10",
      read: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-forest text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
          <p className="text-gray-200">Manage your properties, payments, and communications</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === "overview" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("overview")}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === "properties" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("properties")}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Properties
                  </Button>
                  <Button 
                    variant={activeTab === "tenants" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("tenants")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Tenants
                  </Button>
                  <Button 
                    variant={activeTab === "payments" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("payments")}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payments
                  </Button>
                  <Button 
                    variant={activeTab === "messages" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Messages
                    <Badge className="ml-auto bg-red-500">2</Badge>
                  </Button>
                  <Button 
                    variant={activeTab === "invoices" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("invoices")}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Invoices
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{properties.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Rented Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{properties.filter(p => p.status === "Rented").length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">₦{payments.reduce((acc, payment) => acc + parseInt(payment.amount.replace('₦', '').replace(',', '')), 0).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "properties" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Properties</CardTitle>
                    <Button>Add New Property</Button>
                  </div>
                  <CardDescription>Manage all your property listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Next Rent Due</TableHead>
                        <TableHead>Rent Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>
                            <Badge className={property.status === "Rented" ? "bg-forest" : "bg-blue-500"}>
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.tenant}</TableCell>
                          <TableCell>{property.rentDue}</TableCell>
                          <TableCell>{property.rentAmount}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "payments" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track all payments from your tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.tenant}</TableCell>
                          <TableCell>{properties.find(p => p.id === payment.propertyId)?.title}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{payment.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Generate Invoice</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "messages" && (
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communicate with your tenants and interested parties</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>{message.from}</TableCell>
                          <TableCell>{message.subject}</TableCell>
                          <TableCell>{message.date}</TableCell>
                          <TableCell>
                            {!message.read && <Badge className="bg-red-500">Unread</Badge>}
                            {message.read && <Badge variant="outline">Read</Badge>}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Read</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "invoices" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Invoices</CardTitle>
                    <Button>Create New Invoice</Button>
                  </div>
                  <CardDescription>Generate and manage rent invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <p>No invoices generated yet.</p>
                    <p className="mt-2">Use the button above to create your first invoice.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other tab contents would go here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandlordDashboard;
