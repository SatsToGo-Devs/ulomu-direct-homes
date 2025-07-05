
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBasedAIHub from '@/components/AI/RoleBasedAIHub';
import ResponsiveLayout from '@/components/Layout/ResponsiveLayout';
import { useRoleTheme } from '@/hooks/useRoleTheme';
import { Brain } from 'lucide-react';

const AIHub = () => {
  // Apply role-based theming
  useRoleTheme();

  const header = (
    <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-6 sm:py-8">
      <div className="container-responsive">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">AI Hub</h1>
        </div>
        <p className="text-primary-foreground/90 text-sm sm:text-base mt-1">
          Intelligent features powered by advanced AI technology
        </p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <ResponsiveLayout
        header={<Navbar />}
        footer={<Footer />}
        className="bg-background"
      >
        {header}
        <div className="bg-muted/20 min-h-screen">
          <div className="container-responsive py-6 sm:py-8">
            <RoleBasedAIHub />
          </div>
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  );
};

export default AIHub;
