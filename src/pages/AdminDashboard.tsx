
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserManagement from "@/components/Admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-ulomu-beige">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-white/90">Manage users, roles, and system settings</p>
          </div>
        </div>
        <main className="flex-1 bg-ulomu-beige">
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-ulomu-beige-dark">
                <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-terracotta data-[state=active]:text-white">
                  <Users className="h-4 w-4" />
                  User Management
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2 data-[state=active]:bg-forest data-[state=active]:text-white">
                  <Settings className="h-4 w-4" />
                  System Settings
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-ulomu-gold data-[state=active]:text-black">
                  <Shield className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="system">
                <div className="text-center py-12 bg-white rounded-lg border border-ulomu-beige-dark">
                  <Settings className="h-12 w-12 text-forest mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
                  <p className="text-gray-600">System configuration options coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <div className="text-center py-12 bg-white rounded-lg border border-ulomu-beige-dark">
                  <Shield className="h-12 w-12 text-ulomu-gold mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
                  <p className="text-gray-600">System reports and analytics coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
