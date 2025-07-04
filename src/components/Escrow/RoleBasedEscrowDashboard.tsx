
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import LandlordEscrowDashboard from './LandlordEscrowDashboard';
import TenantEscrowDashboard from './TenantEscrowDashboard';
import VendorEscrowDashboard from './VendorEscrowDashboard';
import EscrowDashboard from './EscrowDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Wrench, Shield, Users } from 'lucide-react';

const RoleBasedEscrowDashboard = () => {
  const { userRoles, isLandlord, isTenant, isVendor, isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading escrow dashboard...</p>
        </div>
      </div>
    );
  }

  // If user has multiple roles, show tabs
  const hasMultipleRoles = userRoles.length > 1;
  const availableRoles = [];

  if (isTenant()) availableRoles.push({ role: 'tenant', label: 'Tenant', icon: Home });
  if (isLandlord()) availableRoles.push({ role: 'landlord', label: 'Landlord', icon: Home });
  if (isVendor()) availableRoles.push({ role: 'vendor', label: 'Vendor', icon: Wrench });
  if (isAdmin()) availableRoles.push({ role: 'admin', label: 'Admin', icon: Shield });

  // Single role - show dedicated dashboard
  if (!hasMultipleRoles || availableRoles.length === 1) {
    if (isLandlord()) return <LandlordEscrowDashboard />;
    if (isVendor()) return <VendorEscrowDashboard />;
    if (isTenant()) return <TenantEscrowDashboard />;
    if (isAdmin()) return <EscrowDashboard />;
    return <TenantEscrowDashboard />; // Default fallback
  }

  // Multiple roles - show tabbed interface
  return (
    <div className="space-y-6">
      <div className="border-b">
        <div className="flex items-center gap-2 pb-4">
          <Users className="h-6 w-6 text-terracotta" />
          <h2 className="text-2xl font-bold">Role-Based Escrow Management</h2>
        </div>
      </div>

      <Tabs defaultValue={availableRoles[0]?.role || 'tenant'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          {availableRoles.map(({ role, label, icon: Icon }) => (
            <TabsTrigger key={role} value={role} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label} Escrow</span>
              <span className="sm:hidden">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {isTenant() && (
          <TabsContent value="tenant">
            <TenantEscrowDashboard />
          </TabsContent>
        )}

        {isLandlord() && (
          <TabsContent value="landlord">
            <LandlordEscrowDashboard />
          </TabsContent>
        )}

        {isVendor() && (
          <TabsContent value="vendor">
            <VendorEscrowDashboard />
          </TabsContent>
        )}

        {isAdmin() && (
          <TabsContent value="admin">
            <EscrowDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RoleBasedEscrowDashboard;
