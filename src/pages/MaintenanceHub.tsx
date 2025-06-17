
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Filter,
  Search
} from "lucide-react";

const MaintenanceHub = () => {
  const maintenanceRequests = [
    {
      id: "MR001",
      property: "Lekki Phase 1 Apartment",
      issue: "Air conditioning not cooling properly",
      priority: "High",
      status: "In Progress",
      tenant: "John Adebayo",
      assignedTo: "CoolAir Services",
      dateCreated: "2024-01-15",
      dueDate: "2024-01-17"
    },
    {
      id: "MR002",
      property: "Victoria Island Office",
      issue: "Plumbing leak in bathroom",
      priority: "Medium",
      status: "Scheduled",
      tenant: "Sarah Okafor",
      assignedTo: "Lagos Plumbers",
      dateCreated: "2024-01-14",
      dueDate: "2024-01-18"
    },
    {
      id: "MR003",
      property: "Ikeja Duplex",
      issue: "Electrical socket not working in bedroom",
      priority: "Low",
      status: "Completed",
      tenant: "Mike Johnson",
      assignedTo: "PowerTech Electricians",
      dateCreated: "2024-01-12",
      dueDate: "2024-01-16"
    }
  ];

  const upcomingMaintenance = [
    {
      property: "Marina Heights",
      task: "HVAC System Inspection",
      date: "2024-01-20",
      vendor: "CoolAir Services",
      type: "Preventive"
    },
    {
      property: "Surulere Complex",
      task: "Generator Servicing",
      date: "2024-01-22",
      vendor: "PowerGen Nigeria",
      type: "Routine"
    },
    {
      property: "Gbagada Estate",
      task: "Water Tank Cleaning",
      date: "2024-01-25",
      vendor: "CleanWater Services",
      type: "Routine"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Maintenance Hub</h1>
          <p className="text-blue-100">Manage all your property maintenance with AI-powered efficiency</p>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Maintenance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Maintenance Requests</h2>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {maintenanceRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{request.property}</h3>
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
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Tenant:</span>
                          <p className="font-medium">{request.tenant}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Assigned To:</span>
                          <p className="font-medium">{request.assignedTo}</p>
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
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">{request.dueDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button size="sm">Update Status</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Scheduled Maintenance</h2>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New
                </Button>
              </div>

              <div className="grid gap-4">
                {upcomingMaintenance.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.property}</h3>
                          <p className="text-gray-600">{item.task}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {item.date}
                            </span>
                            <span className="text-gray-500">Vendor: {item.vendor}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold">Maintenance Analytics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">4.2 hrs</div>
                    <p className="text-sm text-gray-600">Average response time</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">35%</div>
                    <p className="text-sm text-gray-600">Reduction in maintenance costs</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">94%</div>
                    <p className="text-sm text-gray-600">Tasks completed on time</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MaintenanceHub;
