
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEscrowData } from '@/hooks/useEscrowData';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Home, 
  Wrench, 
  Users,
  Star,
  Shield,
  Brain
} from 'lucide-react';

const RoleBasedEscrowDashboard = () => {
  const { user } = useAuth();
  const { account, transactions, vendorProfile } = useEscrowData();

  // Determine user role from account or transactions
  const getUserRole = () => {
    if (vendorProfile) return 'VENDOR';
    if (account?.role) return account.role;
    
    // Analyze transaction patterns
    const receivedPayments = transactions.filter(t => t.payee_id === user?.id);
    const sentPayments = transactions.filter(t => t.payer_id === user?.id);
    
    if (receivedPayments.length > sentPayments.length) return 'LANDLORD';
    return 'TENANT';
  };

  const userRole = getUserRole();

  // Calculate role-specific metrics
  const getTenantMetrics = () => {
    const sentTransactions = transactions.filter(t => t.payer_id === user?.id);
    const rentPayments = sentTransactions.filter(t => t.purpose === 'rent');
    const maintenanceRequests = sentTransactions.filter(t => t.purpose === 'maintenance');
    
    return {
      totalPaid: sentTransactions.reduce((sum, t) => sum + t.amount, 0),
      rentPayments: rentPayments.length,
      maintenanceRequests: maintenanceRequests.length,
      pendingReleases: sentTransactions.filter(t => t.status === 'HELD').length
    };
  };

  const getLandlordMetrics = () => {
    const receivedTransactions = transactions.filter(t => t.payee_id === user?.id);
    const rentPayments = receivedTransactions.filter(t => t.purpose === 'rent');
    const deposits = receivedTransactions.filter(t => t.purpose === 'deposit');
    
    return {
      totalReceived: receivedTransactions.reduce((sum, t) => sum + t.amount, 0),
      rentPayments: rentPayments.length,
      deposits: deposits.length,
      pendingReleases: receivedTransactions.filter(t => t.status === 'HELD').length
    };
  };

  const getVendorMetrics = () => {
    const vendorTransactions = transactions.filter(t => t.payee_id === user?.id && t.purpose === 'maintenance');
    const completedJobs = vendorTransactions.filter(t => t.status === 'COMPLETED').length;
    
    return {
      totalEarned: vendorTransactions.reduce((sum, t) => sum + t.amount, 0),
      completedJobs,
      pendingJobs: vendorTransactions.filter(t => t.status === 'HELD').length,
      trustScore: vendorProfile?.trust_score || 0.8,
      completionRate: vendorProfile?.completion_rate || 100
    };
  };

  const renderTenantDashboard = () => {
    const metrics = getTenantMetrics();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Total Paid</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ₦{metrics.totalPaid.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Rent Payments</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.rentPayments}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Maintenance</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {metrics.maintenanceRequests}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-gold">
                {metrics.pendingReleases}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Tenant Assistant Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="font-medium text-blue-800">💡 Rent Payment Due Soon</div>
                <div className="text-sm text-blue-600">Your next rent payment is due in 5 days. Set up automatic escrow to avoid late fees.</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="font-medium text-green-800">✅ Maintenance Request Update</div>
                <div className="text-sm text-green-600">Your plumbing repair is 80% complete. Funds will be auto-released in 2 days.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLandlordDashboard = () => {
    const metrics = getLandlordMetrics();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Total Received</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₦{metrics.totalReceived.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Rent Payments</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.rentPayments}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Deposits</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.deposits}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Awaiting Release</span>
              </div>
              <div className="text-2xl font-bold text-gold">
                {metrics.pendingReleases}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-500" />
              Landlord Revenue Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="font-medium text-green-800">📈 Monthly Revenue Trend</div>
                <div className="text-sm text-green-600">Your rental income is up 12% this month. Consider raising rents for market alignment.</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="font-medium text-yellow-800">⚠️ Maintenance Budget Alert</div>
                <div className="text-sm text-yellow-600">3 maintenance requests pending approval. Total estimated cost: ₦85,000</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVendorDashboard = () => {
    const metrics = getVendorMetrics();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Total Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₦{metrics.totalEarned.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Completed Jobs</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.completedJobs}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Trust Score</span>
              </div>
              <div className="text-2xl font-bold text-gold">
                {(metrics.trustScore * 100).toFixed(0)}%
              </div>
              <Progress value={metrics.trustScore * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Completion Rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.completionRate.toFixed(0)}%
              </div>
              <Progress value={metrics.completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Vendor Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="font-medium text-blue-800">🎯 New Job Opportunities</div>
                <div className="text-sm text-blue-600">5 new maintenance requests match your specialties. Apply now for fast-track approval.</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <div className="font-medium text-purple-800">⭐ Trust Score Boost</div>
                <div className="text-sm text-purple-600">Complete 2 more jobs on time to reach Gold tier (95% trust score) and unlock premium features.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <Card className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {userRole === 'TENANT' && '🏠 Tenant Dashboard'}
                {userRole === 'LANDLORD' && '🏢 Landlord Dashboard'}
                {userRole === 'VENDOR' && '🔧 Vendor Dashboard'}
              </h2>
              <p className="text-white/90">
                {userRole === 'TENANT' && 'Manage your rent payments and maintenance requests'}
                {userRole === 'LANDLORD' && 'Track rental income and property management'}
                {userRole === 'VENDOR' && 'Monitor job completion and earnings'}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {userRole}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Dashboard */}
      {userRole === 'TENANT' && renderTenantDashboard()}
      {userRole === 'LANDLORD' && renderLandlordDashboard()}
      {userRole === 'VENDOR' && renderVendorDashboard()}
    </div>
  );
};

export default RoleBasedEscrowDashboard;
