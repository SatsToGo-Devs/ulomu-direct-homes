import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/LandlordDashboard/Sidebar";
import Overview from "@/components/LandlordDashboard/Overview";
import Properties from "@/components/LandlordDashboard/Properties";
import Tenants from "@/components/LandlordDashboard/Tenants";
import Payments from "@/components/LandlordDashboard/Payments";
import Messages from "@/components/LandlordDashboard/Messages";
import Invoices from "@/components/LandlordDashboard/Invoices";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const navigate = useNavigate();
  const { properties, loading } = useProperties();

  // Mock data for payments and messages - keeping existing functionality
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
    <div className="min-h-screen flex flex-col bg-ulomu-beige">
      <Navbar />
      <div className="bg-gradient-to-r from-forest to-forest/90 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
              <p className="text-white/90">Manage your properties, payments, and communications</p>
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

            {activeTab === "tenants" && (
              <Tenants />
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

            {/* Placeholder for settings */}
            {activeTab === "settings" && (
              <div className="bg-white p-6 rounded-lg shadow border border-ulomu-beige-dark">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
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
