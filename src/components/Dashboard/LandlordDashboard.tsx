
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
import { 
  Home, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Wrench, 
  FileText, 
  Shield, 
  BarChart3,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  PiggyBank
} from 'lucide-react';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { transactions, serviceCharges, loading } = useEscrowData();

  // Calculate landlord metrics
  const rentTransactions = transactions.filter(t => t.purpose?.includes('RENT') || t.type === 'RENT');
  const maintenanceTransactions = transactions.filter(t => t.purpose?.includes('MAINTENANCE'));
  const totalRentCollected = rentTransactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0);
  const totalServiceCharges = serviceCharges.reduce((sum, sc) => sum + sc.amount, 0);
  const pendingReleases = transactions.filter(t => t.status === 'HELD');

  const quickActions = [
    { icon: Home, label: 'Manage Properties', route: '/properties', color: 'bg-blue-500', description: 'Add, edit, and view properties' },
    { icon: Users, label: 'Tenant Management', route: '/tenants', color: 'bg-green-500', description: 'Manage tenant relationships' },
    { icon: DollarSign, label: 'Rent Collection', route: '/escrow', color: 'bg-purple-500', description: 'Track and collect rent payments' },
    { icon: Wrench, label: 'Maintenance Hub', route: '/maintenance', color: 'bg-orange-500', description: 'Handle maintenance requests' },
    { icon: BarChart3, label: 'Analytics', route: '/ai-insights', color: 'bg-indigo-500', description: 'Property performance insights' },
    { icon: FileText, label: 'Generate Invoices', route: '/landlord-dashboard', color: 'bg-teal-500', description: 'Create and send invoices' }
  ];

  const propertyPerformance = [
    { name: 'Property A', occupancy: 95, revenue: 450000, status: 'excellent' },
    { name: 'Property B', occupancy: 87, revenue: 380000, status: 'good' },
    { name: 'Property C', occupancy: 76, revenue: 320000, status: 'needs-attention' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Landlord Command Center</h1>
        <p className="text-green-100">Manage your properties, tenants, and revenue streams efficiently</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Rent Collected</p>
                <p className="text-2xl font-bold text-green-800">₦{totalRentCollected.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-green-600">{rentTransactions.filter(t => t.status === 'COMPLETED').length} payments received</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Service Charges</p>
                <p className="text-2xl font-bold text-blue-800">₦{totalServiceCharges.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">{serviceCharges.length} active charges</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Properties</p>
                <p className="text-2xl font-bold text-purple-800">5</p>
              </div>
            </div>
            <p className="text-xs text-purple-600">92% occupancy rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Pending Releases</p>
                <p className="text-2xl font-bold text-orange-800">{pendingReleases.length}</p>
              </div>
            </div>
            <p className="text-xs text-orange-600">₦{pendingReleases.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} held</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-green-500"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Property Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-sm text-gray-500">Monthly Revenue: ₦{property.revenue.toLocaleString()}</p>
                  </div>
                  <Badge 
                    className={
                      property.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      property.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }
                  >
                    {property.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Occupancy Rate</span>
                    <span>{property.occupancy}%</span>
                  </div>
                  <Progress value={property.occupancy} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.purpose || transaction.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{transaction.amount.toLocaleString()}</p>
                    <Badge 
                      variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Maintenance Request</span>
              </div>
              <p className="text-sm text-orange-700">Unit 2A - Plumbing issue reported</p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Rent Due</span>
              </div>
              <p className="text-sm text-blue-700">3 tenants have rent due in 3 days</p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Payment Received</span>
              </div>
              <p className="text-sm text-green-700">Unit 1B - Rent payment completed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
