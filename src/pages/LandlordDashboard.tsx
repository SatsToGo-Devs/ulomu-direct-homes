
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/LandlordDashboard/Sidebar";
import Overview from "@/components/LandlordDashboard/Overview";
import Properties from "@/components/LandlordDashboard/Properties";
import Payments from "@/components/LandlordDashboard/Payments";
import Messages from "@/components/LandlordDashboard/Messages";
import Invoices from "@/components/LandlordDashboard/Invoices";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const navigate = useNavigate();

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

  // Count unread messages
  const unreadMessageCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-forest text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
              <p className="text-gray-200">Manage your properties, payments, and communications</p>
            </div>
            <Button 
              onClick={() => navigate('/tenants')}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Tenants
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              unreadMessageCount={unreadMessageCount} 
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <Overview properties={properties} payments={payments} />
            )}

            {activeTab === "properties" && (
              <Properties />
            )}

            {activeTab === "payments" && (
              <Payments payments={payments} properties={properties} />
            )}

            {activeTab === "messages" && (
              <Messages messages={messages} />
            )}

            {activeTab === "invoices" && (
              <Invoices />
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === "tenants" || activeTab === "settings") && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                <p className="text-gray-500">This feature is coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandlordDashboard;
