
import React, { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  Users, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Brain, 
  Wallet,
  Wrench,
  Star,
  UserPlus,
  TrendingUp,
  Settings,
  BarChart3,
  Bell,
  User,
  Palette
} from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  route?: string;
  comingSoon?: boolean;
}

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const { userRoles, loading, isAdmin, isLandlord, isVendor, isTenant } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');

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

  const adminFeatures: FeatureItem[] = [
    {
      title: 'User Management',
      description: 'View all users, assign/remove roles, manage user permissions',
      icon: <Users className="h-5 w-5" />,
      route: '/admin-dashboard'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide parameters',
      icon: <Settings className="h-5 w-5" />,
      comingSoon: true
    },
    {
      title: 'Reports & Analytics',
      description: 'System reports and analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      comingSoon: true
    }
  ];

  const landlordFeatures: FeatureItem[] = [
    {
      title: 'Property Management',
      description: 'Add, edit, and manage properties',
      icon: <Home className="h-5 w-5" />,
      route: '/properties'
    },
    {
      title: 'Tenant Management',
      description: 'View tenants, manage tenant relationships',
      icon: <Users className="h-5 w-5" />,
      route: '/tenants'
    },
    {
      title: 'Payment Tracking',
      description: 'Monitor rent payments and payment history',
      icon: <CreditCard className="h-5 w-5" />,
      route: '/landlord-dashboard'
    },
    {
      title: 'Maintenance Requests',
      description: 'View and respond to tenant maintenance requests',
      icon: <Wrench className="h-5 w-5" />,
      route: '/maintenance'
    },
    {
      title: 'Messages',
      description: 'Communication hub with tenants',
      icon: <MessageSquare className="h-5 w-5" />,
      route: '/landlord-dashboard'
    },
    {
      title: 'Invoice Generation',
      description: 'Create and manage rent invoices',
      icon: <FileText className="h-5 w-5" />,
      route: '/landlord-dashboard'
    },
    {
      title: 'AI Insights',
      description: 'Get AI-powered property insights and predictions',
      icon: <Brain className="h-5 w-5" />,
      route: '/ai-insights'
    },
    {
      title: 'Escrow Management',
      description: 'Secure payment handling for maintenance and rent',
      icon: <Wallet className="h-5 w-5" />,
      route: '/escrow'
    }
  ];

  const vendorFeatures: FeatureItem[] = [
    {
      title: 'Vendor Dashboard',
      description: 'Track jobs, earnings, and performance metrics',
      icon: <TrendingUp className="h-5 w-5" />,
      route: '/dashboard'
    },
    {
      title: 'Job Applications',
      description: 'Apply for maintenance work opportunities',
      icon: <UserPlus className="h-5 w-5" />,
      route: '/maintenance'
    },
    {
      title: 'Vendor Onboarding',
      description: 'Complete profile setup and verification',
      icon: <User className="h-5 w-5" />,
      route: '/profile'
    },
    {
      title: 'Escrow Transactions',
      description: 'Receive secure payments for completed work',
      icon: <Wallet className="h-5 w-5" />,
      route: '/escrow'
    },
    {
      title: 'AI Vendor Matching',
      description: 'Get matched with relevant job opportunities',
      icon: <Brain className="h-5 w-5" />,
      route: '/ai-insights'
    },
    {
      title: 'Trust Score Tracking',
      description: 'Monitor completion rate and reputation',
      icon: <Star className="h-5 w-5" />,
      route: '/profile'
    }
  ];

  const tenantFeatures: FeatureItem[] = [
    {
      title: 'Tenant Portal',
      description: 'Comprehensive tenant management interface',
      icon: <Home className="h-5 w-5" />,
      route: '/tenant-portal'
    },
    {
      title: 'Maintenance Requests',
      description: 'Submit and track maintenance requests',
      icon: <Wrench className="h-5 w-5" />,
      route: '/maintenance'
    },
    {
      title: 'Payment Portal',
      description: 'Make rent payments and view payment history',
      icon: <CreditCard className="h-5 w-5" />,
      route: '/escrow'
    },
    {
      title: 'Communication',
      description: 'Message landlords and property managers',
      icon: <MessageSquare className="h-5 w-5" />,
      route: '/tenant-portal'
    },
    {
      title: 'Lease Management',
      description: 'View lease details and renewal options',
      icon: <FileText className="h-5 w-5" />,
      route: '/tenant-portal'
    },
    {
      title: 'Service Requests',
      description: 'Track all service-related communications',
      icon: <Settings className="h-5 w-5" />,
      route: '/tenant-portal'
    },
    {
      title: 'Escrow Payments',
      description: 'Secure rent and deposit payments',
      icon: <Wallet className="h-5 w-5" />,
      route: '/escrow'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with tenant-related questions',
      icon: <Brain className="h-5 w-5" />,
      route: '/chat-assistant'
    }
  ];

  const coreFeatures: FeatureItem[] = [
    {
      title: 'Profile Management',
      description: 'Update personal information and settings',
      icon: <User className="h-5 w-5" />,
      route: '/profile'
    },
    {
      title: 'Chat Assistant',
      description: 'AI-powered help and support',
      icon: <Brain className="h-5 w-5" />,
      route: '/chat-assistant'
    },
    {
      title: 'Notifications',
      description: 'System alerts and important updates',
      icon: <Bell className="h-5 w-5" />,
      route: '/dashboard'
    },
    {
      title: 'Theme Toggle',
      description: 'Switch between light and dark modes',
      icon: <Palette className="h-5 w-5" />,
      route: '/dashboard'
    }
  ];

  const handleFeatureClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  const renderFeatureGrid = (features: FeatureItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <Card 
          key={index} 
          className={`hover:shadow-md transition-shadow cursor-pointer ${
            feature.comingSoon ? 'opacity-60' : ''
          }`}
          onClick={() => !feature.comingSoon && handleFeatureClick(feature.route)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {feature.icon}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              {feature.comingSoon && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{feature.description}</p>
            {!feature.comingSoon && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick(feature.route);
                }}
              >
                Access Feature
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

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

  // Determine which tabs to show based on user roles - prioritize tenant role
  const availableTabs = [];
  
  // Always show tenant tab first if user is a tenant
  if (isTenant()) {
    availableTabs.push({ key: 'tenant', label: 'Tenant Features', icon: <Home className="h-4 w-4" /> });
  }
  
  if (isLandlord()) {
    availableTabs.push({ key: 'landlord', label: 'Landlord Features', icon: <Home className="h-4 w-4" /> });
  }
  
  if (isVendor()) {
    availableTabs.push({ key: 'vendor', label: 'Vendor Features', icon: <Wrench className="h-4 w-4" /> });
  }
  
  if (isAdmin()) {
    availableTabs.push({ key: 'admin', label: 'Admin Features', icon: <Shield className="h-4 w-4" /> });
  }
  
  // Always show core features
  availableTabs.push({ key: 'core', label: 'Core Features', icon: <Settings className="h-4 w-4" /> });

  // Set default active tab - prioritize tenant if available
  useEffect(() => {
    if (!activeTab && availableTabs.length > 0) {
      // If user is tenant, default to tenant tab, otherwise use first available
      if (isTenant()) {
        setActiveTab('tenant');
      } else {
        setActiveTab(availableTabs[0].key);
      }
    }
  }, [availableTabs, activeTab, isTenant]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-gray-600">Welcome back! Your roles:</p>
          {userRoles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-8">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {isTenant() && (
          <TabsContent value="tenant" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Tenant Features</h2>
              <Badge className="bg-blue-100 text-blue-800">Resident</Badge>
            </div>
            {renderFeatureGrid(tenantFeatures)}
          </TabsContent>
        )}

        {isLandlord() && (
          <TabsContent value="landlord" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">Landlord Features</h2>
              <Badge className="bg-green-100 text-green-800">Property Management</Badge>
            </div>
            {renderFeatureGrid(landlordFeatures)}
          </TabsContent>
        )}

        {isVendor() && (
          <TabsContent value="vendor" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold">Vendor Features</h2>
              <Badge className="bg-orange-100 text-orange-800">Service Provider</Badge>
            </div>
            {renderFeatureGrid(vendorFeatures)}
          </TabsContent>
        )}

        {isAdmin() && (
          <TabsContent value="admin" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold">Admin Features</h2>
              <Badge className="bg-red-100 text-red-800">Full Access</Badge>
            </div>
            {renderFeatureGrid(adminFeatures)}
          </TabsContent>
        )}

        <TabsContent value="core" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold">Core Features</h2>
            <Badge className="bg-gray-100 text-gray-800">Available to All</Badge>
          </div>
          {renderFeatureGrid(coreFeatures)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleBasedDashboard;
