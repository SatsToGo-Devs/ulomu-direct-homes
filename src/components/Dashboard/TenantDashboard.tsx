
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
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
  Bell,
  TrendingUp
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
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Tenant Portal</h1>
        <p className="text-white/90">Manage your rental payments, maintenance requests, and communications</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-forest rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Total Paid</p>
                <p className="text-2xl font-bold text-forest">₦{totalPaid.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-forest/80">{rentPayments.filter(t => t.status === 'COMPLETED').length} payments made</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-terracotta rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-terracotta">Pending</p>
                <p className="text-2xl font-bold text-terracotta">{pendingPayments}</p>
              </div>
            </div>
            <p className="text-xs text-terracotta/80">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-ulomu-gold/10 to-ulomu-gold/20 border-ulomu-gold/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-ulomu-gold rounded-lg">
                <Calendar className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-ulomu-gold">Due Soon</p>
                <p className="text-2xl font-bold text-ulomu-gold">{upcomingPayments.length}</p>
              </div>
            </div>
            <p className="text-xs text-ulomu-gold/80">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-forest rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Rental Status</p>
                <p className="text-lg font-bold text-forest">Active</p>
              </div>
            </div>
            <p className="text-xs text-forest/80">Lease in good standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-terracotta" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-terracotta bg-ulomu-beige"
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

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <Card className="border-terracotta/30 bg-terracotta/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-terracotta">
              <AlertTriangle className="h-5 w-5" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((charge) => (
                <div key={charge.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-ulomu-beige-dark">
                  <div>
                    <p className="font-medium">{charge.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(charge.next_due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-terracotta">₦{charge.amount.toLocaleString()}</p>
                    <Button 
                      size="sm" 
                      className="mt-1 bg-terracotta hover:bg-terracotta/90"
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
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No payment history yet</p>
                <Button onClick={() => navigate('/escrow')} className="bg-terracotta hover:bg-terracotta/90">
                  Make First Payment
                </Button>
              </div>
            ) : (
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
