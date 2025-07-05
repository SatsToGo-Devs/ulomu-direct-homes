
import React, { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Import role-specific dashboards
import TenantDashboard from './TenantDashboard';
import LandlordDashboard from './LandlordDashboard';
import VendorDashboard from './VendorDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const { userRoles, loading, isAdmin, isLandlord, isVendor, isTenant } = useUserRole();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('RoleBasedDashboard - User:', user);
    console.log('RoleBasedDashboard - User Roles:', userRoles);
    console.log('RoleBasedDashboard - Loading:', loading);
    console.log('RoleBasedDashboard - isTenant():', isTenant());
    console.log('RoleBasedDashboard - isLandlord():', isLandlord());
    console.log('RoleBasedDashboard - isVendor():', isVendor());
    console.log('RoleBasedDashboard - isAdmin():', isAdmin());
  }, [user, userRoles, loading, isTenant, isLandlord, isVendor, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please Sign In</h3>
          <p className="text-gray-600">You need to be signed in to access your dashboard features.</p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="mt-4 bg-terracotta hover:bg-terracotta/90"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show message if no roles found
  if (userRoles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Setting up your account...</h3>
          <p className="text-gray-600">We're assigning your default role. Please refresh the page in a moment.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-terracotta hover:bg-terracotta/90"
          >
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Determine which dashboard to show based on user's primary role
  // Priority order: admin > landlord > vendor > tenant
  if (isAdmin()) {
    return <AdminDashboard />;
  }
  
  if (isLandlord()) {
    return <LandlordDashboard />;
  }
  
  if (isVendor()) {
    return <VendorDashboard />;
  }
  
  // Default to tenant dashboard (most common role)
  return <TenantDashboard />;
};

export default RoleBasedDashboard;
