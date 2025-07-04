
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBasedDashboard from '@/components/Dashboard/RoleBasedDashboard';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <RoleBasedDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
