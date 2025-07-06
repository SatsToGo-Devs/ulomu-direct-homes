
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
import { cn } from '@/lib/utils';
import EnhancedDashboardMetrics from './EnhancedDashboardMetrics';
import MobileOptimizedQuickActions from './MobileOptimizedQuickActions';
import AnimatedCard from './AnimatedCard';
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
    { icon: Home, label: 'Manage Properties', route: '/properties', color: 'bg-terracotta', description: 'Add, edit, and view your properties' },
    { icon: Users, label: 'Tenant Management', route: '/tenants', color: 'bg-forest', description: 'Manage tenant relationships and communications' },
    { icon: DollarSign, label: 'Rent Collection', route: '/escrow', color: 'bg-ulomu-gold', description: 'Track and collect rent payments securely' },
    { icon: Wrench, label: 'Maintenance Hub', route: '/maintenance', color: 'bg-forest', description: 'Handle maintenance requests efficiently' },
    { icon: BarChart3, label: 'Analytics', route: '/ai-insights', color: 'bg-terracotta', description: 'Property performance insights and analytics' },
    { icon: FileText, label: 'Generate Invoices', route: '/landlord-dashboard', color: 'bg-ulomu-gold', description: 'Create and send invoices to tenants' }
  ];

  const propertyPerformance = [
    { name: 'Lekki Property', occupancy: 95, revenue: 450000, status: 'excellent' },
    { name: 'Victoria Island Duplex', occupancy: 87, revenue: 380000, status: 'good' },
    { name: 'Ikeja Apartment Complex', occupancy: 76, revenue: 320000, status: 'needs-attention' }
  ];

  if (loading) {
    return (
      <div className="container-responsive space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <EnhancedDashboardMetrics
              key={i}
              title=""
              value=""
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive space-y-6 sm:space-y-8 bg-ulomu-beige min-h-screen">
      {/* Enhanced Welcome Header */}
      <AnimatedCard className="bg-gradient-to-r from-forest to-forest/90 text-white border-none shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-fade-in">
                Landlord Command Center
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg animate-fade-in animate-stagger-1">
                Manage your properties, tenants, and revenue streams efficiently
              </p>
            </div>
            <div className="animate-scale-in animate-stagger-2">
              <Home className="h-12 w-12 sm:h-16 sm:w-16 text-white/20" />
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedDashboardMetrics
          title="Rent Collected"
          value={`₦${totalRentCollected.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          variant="forest"
          change={{
            value: 12.5,
            label: "vs last month"
          }}
        />

        <EnhancedDashboardMetrics
          title="Service Charges"
          value={`₦${totalServiceCharges.toLocaleString()}`}
          icon={<PiggyBank className="h-5 w-5 text-black" />}
          variant="gold"
        />

        <EnhancedDashboardMetrics
          title="Properties"
          value={5}
          icon={<Home className="h-5 w-5 text-white" />}
          variant="terracotta"
          change={{
            value: 92,
            label: "occupancy rate"
          }}
        />

        <EnhancedDashboardMetrics
          title="Pending Releases"
          value={pendingReleases.length}
          icon={<Clock className="h-5 w-5 text-white" />}
          variant="terracotta"
        />
      </div>

      {/* Enhanced Quick Actions */}
      <MobileOptimizedQuickActions
        title="Management Tools"
        actions={quickActions}
        roleColor="forest"
      />

      {/* Enhanced Property Performance Overview */}
      <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={200}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-terracotta" />
            Property Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyPerformance.map((property, index) => (
              <AnimatedCard 
                key={index} 
                className="bg-gradient-to-r from-ulomu-beige to-white border-ulomu-beige-dark hover:shadow-md"
                delay={index * 100}
                hover={true}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{property.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Monthly Revenue: ₦{property.revenue.toLocaleString()}</p>
                    </div>
                    <Badge 
                      className={cn(
                        "self-start sm:self-center transition-all duration-200",
                        property.status === 'excellent' ? 'bg-forest text-white hover:bg-forest/90' :
                        property.status === 'good' ? 'bg-terracotta text-white hover:bg-terracotta/90' :
                        'bg-ulomu-gold text-black hover:bg-ulomu-gold/90'
                      )}
                    >
                      {property.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Occupancy Rate</span>
                      <span className="font-medium">{property.occupancy}%</span>
                    </div>
                    <Progress value={property.occupancy} className="h-2 transition-all duration-500" />
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={300}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-forest" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <AnimatedCard 
                  key={transaction.id} 
                  className="bg-ulomu-beige hover:bg-ulomu-beige-dark border-none"
                  delay={index * 50}
                  hover={true}
                >
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                            "text-xs transition-all duration-200",
                            transaction.status === 'COMPLETED' ? 'bg-forest text-white hover:bg-forest/90' : 'bg-ulomu-beige-dark text-gray-700 hover:bg-gray-200'
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={400}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-terracotta" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatedCard className="bg-gradient-to-r from-terracotta/5 to-terracotta/10 border-terracotta/30 hover:shadow-sm" delay={100}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-terracotta flex-shrink-0 animate-pulse" />
                  <span className="font-medium text-terracotta text-sm sm:text-base">Maintenance Request</span>
                </div>
                <p className="text-xs sm:text-sm text-terracotta/80">Unit 2A - Plumbing issue reported</p>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard className="bg-gradient-to-r from-ulomu-gold/5 to-ulomu-gold/10 border-ulomu-gold/30 hover:shadow-sm" delay={200}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-ulomu-gold flex-shrink-0" />
                  <span className="font-medium text-ulomu-gold text-sm sm:text-base">Rent Due</span>
                </div>
                <p className="text-xs sm:text-sm text-ulomu-gold/80">3 tenants have rent due in 3 days</p>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard className="bg-gradient-to-r from-forest/5 to-forest/10 border-forest/30 hover:shadow-sm" delay={300}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-forest flex-shrink-0" />
                  <span className="font-medium text-forest text-sm sm:text-base">Payment Received</span>
                </div>
                <p className="text-xs sm:text-sm text-forest/80">Unit 1B - Rent payment completed</p>
              </CardContent>
            </AnimatedCard>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default LandlordDashboard;
