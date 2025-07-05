
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBasedDashboard from '@/components/Dashboard/RoleBasedDashboard';
import Navbar from '@/components/Navbar';
import { useRoleTheme } from '@/hooks/useRoleTheme';

const Dashboard = () => {
  const { loading } = useAuth();
  
  // Apply role-based theming
  useRoleTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="dashboard-main">
          <RoleBasedDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
