
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Wrench, 
  Calendar, 
  Bell,
  CreditCard,
  User,
  Send,
  Phone,
  Mail
} from "lucide-react";

const TenantPortal = () => {
  const myRequests = [
    {
      id: "TR001",
      issue: "Air conditioning not cooling",
      status: "In Progress",
      dateSubmitted: "2024-01-15",
      priority: "High",
      assignedTechnician: "CoolAir Services"
    },
    {
      id: "TR002",
      issue: "Kitchen faucet dripping",
      status: "Scheduled",
      dateSubmitted: "2024-01-12",
      priority: "Medium",
      assignedTechnician: "Lagos Plumbers"
    },
    {
      id: "TR003",
      issue: "Light bulb replacement in hallway",
      status: "Completed",
      dateSubmitted: "2024-01-10",
      priority: "Low",
      assignedTechnician: "Maintenance Team"
    }
  ];

  const announcements = [
    {
      title: "Scheduled Maintenance - Generator Servicing",
      date: "2024-01-20",
      content: "Generator maintenance will be conducted from 9 AM to 12 PM. Brief power interruption expected."
    },
    {
      title: "Water Tank Cleaning",
      date: "2024-01-25",
      content: "Water supply will be temporarily interrupted from 8 AM to 2 PM for tank cleaning."
    },
    {
      title: "New Waste Collection Schedule",
      date: "2024-01-18",
      content: "Waste collection days have changed to Tuesday and Friday. Please place bins outside by 6 AM."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Tenant Portal</h1>
          <p className="text-green-100">Your gateway to seamless property communication</p>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="chatbot" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="chatbot" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    AI Maintenance Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">Hello! I'm your AI maintenance assistant. How can I help you today?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">My air conditioner is making a strange noise</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">I understand you're experiencing AC issues. Let me ask a few questions to help diagnose the problem:</p>
                          <p className="text-sm mt-2">1. When did you first notice the noise?</p>
                          <p className="text-sm">2. Can you describe the sound (grinding, squealing, clicking)?</p>
                          <p className="text-sm">3. Is the AC still cooling properly?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Quick Actions:</strong> Report maintenance issue • Check request status • Emergency contact
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Maintenance Requests</h2>
                <Button>
                  <Wrench className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>

              <div className="grid gap-4">
                {myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Request #{request.id}</h3>
                          <p className="text-gray-600">{request.issue}</p>
                        </div>
                        <Badge 
                          variant={
                            request.status === 'Completed' ? 'default' : 
                            request.status === 'In Progress' ? 'secondary' : 'outline'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date Submitted:</span>
                          <p className="font-medium">{request.dateSubmitted}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <p className={`font-medium ${
                            request.priority === 'High' ? 'text-red-600' :
                            request.priority === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {request.priority}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Assigned To:</span>
                          <p className="font-medium">{request.assignedTechnician}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* New Request Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit New Maintenance Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Description</label>
                    <Input placeholder="Briefly describe the issue..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Detailed Description</label>
                    <Textarea placeholder="Provide detailed information about the problem..." rows={4} />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority Level</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Plumbing</option>
                        <option>Electrical</option>
                        <option>HVAC</option>
                        <option>Appliances</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="w-full">Submit Request</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-6">
              <h2 className="text-2xl font-bold">Property Announcements</h2>
              
              <div className="grid gap-4">
                {announcements.map((announcement, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Bell className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{announcement.title}</h3>
                            <span className="text-sm text-gray-500">{announcement.date}</span>
                          </div>
                          <p className="text-gray-600">{announcement.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold">My Profile</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input defaultValue="John Adebayo" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input defaultValue="john.adebayo@email.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input defaultValue="+234 901 234 5678" />
                    </div>
                    
                    <Button>Update Information</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-gray-500">Property:</span>
                      <p className="font-medium">Lekki Phase 1 Apartment</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Unit:</span>
                      <p className="font-medium">Apartment 4B</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Lease Start:</span>
                      <p className="font-medium">January 1, 2024</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Lease End:</span>
                      <p className="font-medium">December 31, 2024</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <Phone className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Emergency Maintenance</p>
                        <p className="text-sm text-red-600">+234 901 234 5678</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Property Manager</p>
                        <p className="text-sm text-blue-600">manager@ulomu.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TenantPortal;
