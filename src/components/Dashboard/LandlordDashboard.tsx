import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
import ResponsiveDashboardCard from './ResponsiveDashboardCard';
import ResponsiveQuickActions from './ResponsiveQuickActions';
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
      <div className="container-responsive space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-ulomu-beige">
              <CardContent className="p-4 sm:p-6">
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
    <div className="container-responsive space-y-6 sm:space-y-8 bg-ulomu-beige min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-forest to-forest/90 text-white rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Landlord Command Center</h1>
        <p className="text-white/90 text-sm sm:text-base">Manage your properties, tenants, and revenue streams efficiently</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ResponsiveDashboardCard
          title="Rent Collected"
          icon={<DollarSign className="h-5 w-5 text-white" />}
          value={`₦${totalRentCollected.toLocaleString()}`}
          description={`${rentTransactions.filter(t => t.status === 'COMPLETED').length} payments received`}
          variant="forest"
        />

        <ResponsiveDashboardCard
          title="Service Charges"
          icon={<PiggyBank className="h-5 w-5 text-black" />}
          value={`₦${totalServiceCharges.toLocaleString()}`}
          description={`${serviceCharges.length} active charges`}
          variant="gold"
        />

        <ResponsiveDashboardCard
          title="Properties"
          icon={<Home className="h-5 w-5 text-white" />}
          value={5}
          description="92% occupancy rate"
          variant="terracotta"
        />

        <ResponsiveDashboardCard
          title="Pending Releases"
          icon={<Clock className="h-5 w-5 text-white" />}
          value={pendingReleases.length}
          description={`₦${pendingReleases.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} held`}
          variant="terracotta"
        />
      </div>

      {/* Quick Actions */}
      <ResponsiveQuickActions
        title="Management Tools"
        actions={quickActions}
        roleColor="forest"
      />

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
              <div key={index} className="p-3 sm:p-4 bg-ulomu-beige rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{property.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Monthly Revenue: ₦{property.revenue.toLocaleString()}</p>
                  </div>
                  <Badge 
                    className={cn(
                      "self-start sm:self-center",
                      property.status === 'excellent' ? 'bg-forest text-white' :
                      property.status === 'good' ? 'bg-terracotta text-white' :
                      'bg-ulomu-gold text-black'
                    )}
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
                <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-ulomu-beige rounded-lg gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-sm sm:text-base">{transaction.purpose || transaction.type}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="font-bold text-sm sm:text-base">₦{transaction.amount.toLocaleString()}</p>
                    <Badge 
                      className={cn(
                        "text-xs",
                        transaction.status === 'COMPLETED' ? 'bg-forest text-white' : 'bg-ulomu-beige-dark text-gray-700'
                      )}
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
                <AlertCircle className="h-4 w-4 text-terracotta flex-shrink-0" />
                <span className="font-medium text-terracotta text-sm sm:text-base">Maintenance Request</span>
              </div>
              <p className="text-xs sm:text-sm text-terracotta/80">Unit 2A - Plumbing issue reported</p>
            </div>
            
            <div className="p-3 bg-ulomu-gold/10 border border-ulomu-gold/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-ulomu-gold flex-shrink-0" />
                <span className="font-medium text-ulomu-gold text-sm sm:text-base">Rent Due</span>
              </div>
              <p className="text-xs sm:text-sm text-ulomu-gold/80">3 tenants have rent due in 3 days</p>
            </div>
            
            <div className="p-3 bg-forest/10 border border-forest/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-forest flex-shrink-0" />
                <span className="font-medium text-forest text-sm sm:text-base">Payment Received</span>
              </div>
              <p className="text-xs sm:text-sm text-forest/80">Unit 1B - Rent payment completed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
