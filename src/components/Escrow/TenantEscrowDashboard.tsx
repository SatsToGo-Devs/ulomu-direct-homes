
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEscrowData } from '@/hooks/useEscrowData';
import EnhancedEscrowPaymentModal from './EnhancedEscrowPaymentModal';
import { 
  Home, 
  Wallet, 
  Shield, 
  Calendar,
  Clock,
  CheckCircle,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';

const TenantEscrowDashboard = () => {
  const { 
    account, 
    transactions, 
    serviceCharges, 
    loading, 
    fetchEscrowData 
  } = useEscrowData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const rentPayments = transactions.filter(t => t.purpose?.includes('RENT') || t.type === 'RENT');
  const upcomingPayments = serviceCharges.filter(sc => {
    const dueDate = new Date(sc.next_due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  const totalPaid = transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Tenant Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Available Balance</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{Number(account?.balance || 0).toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Escrow account
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Total Paid</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{totalPaid.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {transactions.filter(t => t.status === 'COMPLETED').length} payments
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Pending</span>
            </div>
            <div className="text-3xl font-bold">
              {pendingPayments}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Awaiting processing
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Due Soon</span>
            </div>
            <div className="text-3xl font-bold">
              {upcomingPayments.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Next 7 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Payment Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Quick Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Pay Rent
                  </Button>
                }
                defaultPurpose="rent_payment"
                onPaymentComplete={fetchEscrowData} 
              />
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button variant="outline" className="w-full">
                    Service Charge
                  </Button>
                }
                defaultPurpose="service_charge_payment"
                onPaymentComplete={fetchEscrowData} 
              />
            </div>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Security Deposit
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Maintenance Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.map((charge) => (
                  <div key={charge.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{charge.description}</div>
                      <div className="text-xs text-gray-500">
                        Due: {new Date(charge.next_due_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{charge.amount.toLocaleString()}</div>
                      <Button size="sm" className="mt-1">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All payments up to date!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-500 mb-4">Your payment history will appear here.</p>
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Make First Payment
                  </Button>
                }
                onPaymentComplete={fetchEscrowData} 
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.purpose || transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell className="font-medium">₦{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {transaction.status === 'COMPLETED' && (
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantEscrowDashboard;
