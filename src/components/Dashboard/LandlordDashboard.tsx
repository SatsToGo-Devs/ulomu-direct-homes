
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
    { icon: Home, label: 'Manage Properties', route: '/properties', color: 'bg-terracotta', description: 'Add, edit, and view properties' },
    { icon: Users, label: 'Tenant Management', route: '/tenants', color: 'bg-forest', description: 'Manage tenant relationships' },
    { icon: DollarSign, label: 'Rent Collection', route: '/escrow', color: 'bg-ulomu-gold', description: 'Track and collect rent payments' },
    { icon: Wrench, label: 'Maintenance Hub', route: '/maintenance', color: 'bg-forest', description: 'Handle maintenance requests' },
    { icon: BarChart3, label: 'Analytics', route: '/ai-insights', color: 'bg-terracotta', description: 'Property performance insights' },
    { icon: FileText, label: 'Generate Invoices', route: '/landlord-dashboard', color: 'bg-ulomu-gold', description: 'Create and send invoices' }
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
                <div className="h-4 bg-ulomu-beige-dark rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-ulomu-beige-dark rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-ulomu-beige min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-forest to-forest/90 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Landlord Command Center</h1>
        <p className="text-white/90">Manage your properties, tenants, and revenue streams efficiently</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-forest rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Rent Collected</p>
                <p className="text-2xl font-bold text-forest">₦{totalRentCollected.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-forest/80">{rentTransactions.filter(t => t.status === 'COMPLETED').length} payments received</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-ulomu-gold/10 to-ulomu-gold/20 border-ulomu-gold/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-ulomu-gold rounded-lg">
                <PiggyBank className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-ulomu-gold">Service Charges</p>
                <p className="text-2xl font-bold text-ulomu-gold">₦{totalServiceCharges.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-ulomu-gold/80">{serviceCharges.length} active charges</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-terracotta rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-terracotta">Properties</p>
                <p className="text-2xl font-bold text-terracotta">5</p>
              </div>
            </div>
            <p className="text-xs text-terracotta/80">92% occupancy rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-terracotta rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-terracotta">Pending Releases</p>
                <p className="text-2xl font-bold text-terracotta">{pendingReleases.length}</p>
              </div>
            </div>
            <p className="text-xs text-terracotta/80">₦{pendingReleases.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} held</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-forest" />
            Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-forest bg-ulomu-beige"
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
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-terracotta" />
            Property Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="p-4 bg-ulomu-beige rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-sm text-gray-500">Monthly Revenue: ₦{property.revenue.toLocaleString()}</p>
                  </div>
                  <Badge 
                    className={
                      property.status === 'excellent' ? 'bg-forest text-white' :
                      property.status === 'good' ? 'bg-terracotta text-white' :
                      'bg-ulomu-gold text-black'
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
        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-forest" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-ulomu-beige rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.purpose || transaction.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{transaction.amount.toLocaleString()}</p>
                    <Badge 
                      className={transaction.status === 'COMPLETED' ? 'bg-forest text-white' : 'bg-ulomu-beige-dark text-gray-700'}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-terracotta" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-terracotta" />
                <span className="font-medium text-terracotta">Maintenance Request</span>
              </div>
              <p className="text-sm text-terracotta/80">Unit 2A - Plumbing issue reported</p>
            </div>
            
            <div className="p-3 bg-ulomu-gold/10 border border-ulomu-gold/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-ulomu-gold" />
                <span className="font-medium text-ulomu-gold">Rent Due</span>
              </div>
              <p className="text-sm text-ulomu-gold/80">3 tenants have rent due in 3 days</p>
            </div>
            
            <div className="p-3 bg-forest/10 border border-forest/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span className="font-medium text-forest">Payment Received</span>
              </div>
              <p className="text-sm text-forest/80">Unit 1B - Rent payment completed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
