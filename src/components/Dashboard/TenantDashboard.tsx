
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
  CreditCard, 
  Wrench, 
  MessageSquare, 
  FileText, 
  Calendar, 
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell
} from 'lucide-react';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { transactions, serviceCharges, loading } = useEscrowData();

  // Calculate tenant metrics
  const rentPayments = transactions.filter(t => t.purpose?.includes('rent') || t.type === 'RENT');
  const totalPaid = rentPayments.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0);
  const pendingPayments = transactions.filter(t => t.status === 'PENDING').length;
  
  const upcomingPayments = serviceCharges.filter(sc => {
    const dueDate = new Date(sc.next_due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  const quickActions = [
    { icon: CreditCard, label: 'Pay Rent', route: '/escrow', color: 'bg-terracotta', description: 'Make monthly rent payment securely' },
    { icon: Wrench, label: 'Request Maintenance', route: '/maintenance', color: 'bg-forest', description: 'Submit maintenance requests quickly' },
    { icon: MessageSquare, label: 'Contact Landlord', route: '/tenant-portal', color: 'bg-forest', description: 'Send messages to property manager' },
    { icon: FileText, label: 'View Lease', route: '/tenant-portal', color: 'bg-ulomu-gold', description: 'Access lease documents and terms' },
    { icon: Calendar, label: 'Payment History', route: '/escrow', color: 'bg-terracotta', description: 'View complete payment records' },
    { icon: Bell, label: 'Notifications', route: '/dashboard', color: 'bg-forest', description: 'Check important updates', badge: pendingPayments > 0 ? String(pendingPayments) : undefined }
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
      <AnimatedCard className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white border-none shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-fade-in">
                Welcome to Your Tenant Portal
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg animate-fade-in animate-stagger-1">
                Manage your rental payments, maintenance requests, and communications
              </p>
            </div>
            <div className="animate-scale-in animate-stagger-2">
              <Home className="h-12 w-12 sm:h-16 sm:w-16 text-white/20" />
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedDashboardMetrics
          title="Total Paid"
          value={`₦${totalPaid.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          variant="forest"
          change={{
            value: 5.2,
            label: "vs last month"
          }}
        />

        <EnhancedDashboardMetrics
          title="Pending"
          value={pendingPayments}
          icon={<Clock className="h-5 w-5 text-white" />}
          variant="terracotta"
        />

        <EnhancedDashboardMetrics
          title="Due Soon"
          value={upcomingPayments.length}
          icon={<Calendar className="h-5 w-5 text-black" />}
          variant="gold"
        />

        <EnhancedDashboardMetrics
          title="Rental Status"
          value="Active"
          icon={<Home className="h-5 w-5 text-white" />}
          variant="forest"
        />
      </div>

      {/* Enhanced Quick Actions */}
      <MobileOptimizedQuickActions
        title="Quick Actions"
        actions={quickActions}
        roleColor="terracotta"
      />

      {/* Enhanced Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <AnimatedCard className="border-terracotta/30 bg-gradient-to-r from-terracotta/5 to-terracotta/10 shadow-md" delay={200}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-terracotta text-lg">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((charge, index) => (
                <AnimatedCard 
                  key={charge.id} 
                  className="bg-white border-terracotta/20 hover:shadow-md"
                  delay={index * 100}
                  hover={true}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm sm:text-base">{charge.description}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Due: {new Date(charge.next_due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <p className="font-bold text-terracotta text-sm sm:text-base">₦{charge.amount.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto transition-all duration-200 hover:scale-105"
                          onClick={() => navigate('/escrow')}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={300}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-forest" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 animate-float" />
                <p className="text-gray-500 mb-4 text-sm sm:text-base">No payment history yet</p>
                <Button 
                  onClick={() => navigate('/escrow')} 
                  className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto transition-all duration-200 hover:scale-105"
                >
                  Make First Payment
                </Button>
              </div>
            ) : (
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
            )}
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={400}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-forest" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Status</span>
              <Badge className="bg-forest text-white">Up to Date</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lease Status</span>
              <Badge className="bg-terracotta text-white">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security Deposit</span>
              <Badge className="bg-ulomu-gold text-black">Secured</Badge>
            </div>
            <div className="pt-3 border-t border-ulomu-beige-dark">
              <p className="text-sm text-gray-600 mb-2">Payment Reliability Score</p>
              <Progress value={95} className="h-3 transition-all duration-500" />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Excellent (95%)
              </p>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default TenantDashboard;
