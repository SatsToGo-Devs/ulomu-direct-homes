import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
import { cn } from '@/lib/utils';
import ResponsiveDashboardCard from './ResponsiveDashboardCard';
import ResponsiveQuickActions from './ResponsiveQuickActions';
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
    { icon: CreditCard, label: 'Pay Rent', route: '/escrow', color: 'bg-terracotta', description: 'Make monthly rent payment' },
    { icon: Wrench, label: 'Request Maintenance', route: '/maintenance', color: 'bg-forest', description: 'Submit maintenance requests' },
    { icon: MessageSquare, label: 'Contact Landlord', route: '/tenant-portal', color: 'bg-forest', description: 'Send messages to property manager' },
    { icon: FileText, label: 'View Lease', route: '/tenant-portal', color: 'bg-ulomu-gold', description: 'Access lease documents' },
    { icon: Calendar, label: 'Payment History', route: '/escrow', color: 'bg-terracotta', description: 'View payment records' },
    { icon: Bell, label: 'Notifications', route: '/dashboard', color: 'bg-forest', description: 'Check important updates' }
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
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to Your Tenant Portal</h1>
        <p className="text-white/90 text-sm sm:text-base">Manage your rental payments, maintenance requests, and communications</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ResponsiveDashboardCard
          title="Total Paid"
          icon={<DollarSign className="h-5 w-5 text-white" />}
          value={`₦${totalPaid.toLocaleString()}`}
          description={`${rentPayments.filter(t => t.status === 'COMPLETED').length} payments made`}
          variant="forest"
        />

        <ResponsiveDashboardCard
          title="Pending"
          icon={<Clock className="h-5 w-5 text-white" />}
          value={pendingPayments}
          description="Awaiting processing"
          variant="terracotta"
        />

        <ResponsiveDashboardCard
          title="Due Soon"
          icon={<Calendar className="h-5 w-5 text-black" />}
          value={upcomingPayments.length}
          description="Next 7 days"
          variant="gold"
        />

        <ResponsiveDashboardCard
          title="Rental Status"
          icon={<Home className="h-5 w-5 text-white" />}
          value="Active"
          description="Lease in good standing"
          variant="forest"
        />
      </div>

      {/* Quick Actions */}
      <ResponsiveQuickActions
        title="Quick Actions"
        actions={quickActions}
        roleColor="terracotta"
      />

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <Card className="border-terracotta/30 bg-terracotta/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-terracotta text-lg">
              <AlertTriangle className="h-5 w-5" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((charge) => (
                <div key={charge.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-ulomu-beige-dark gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{charge.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(charge.next_due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="font-bold text-terracotta">₦{charge.amount.toLocaleString()}</p>
                    <Button 
                      size="sm" 
                      className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto"
                      onClick={() => navigate('/escrow')}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-forest" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4 text-sm sm:text-base">No payment history yet</p>
                <Button onClick={() => navigate('/escrow')} className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto">
                  Make First Payment
                </Button>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-ulomu-beige-dark">
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
              <Progress value={95} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Excellent (95%)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard;
