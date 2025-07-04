
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEscrowData } from '@/hooks/useEscrowData';
import RoleBasedEscrowDashboard from './RoleBasedEscrowDashboard';
import ServiceChargeOverview from './ServiceChargeOverview';
import EnhancedEscrowPaymentModal from './EnhancedEscrowPaymentModal';
import SmartReleaseWorkflow from './SmartReleaseWorkflow';
import PendingTransactionsManager from './PendingTransactionsManager';
import { 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Bot,
  Filter
} from 'lucide-react';

const EscrowHub = () => {
  const { 
    account, 
    transactions, 
    serviceCharges, 
    disputes, 
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

  const holdTransactions = transactions.filter(t => t.status === 'HELD');
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
  const failedTransactions = transactions.filter(t => t.status === 'FAILED');
  const activeDisputes = disputes.filter(d => d.status === 'OPEN');

  // Calculate total service fees earned (for Ulomu)
  const totalServiceFees = transactions.reduce((sum, t) => sum + (t.service_fee || 0), 0);

  return (
    <div className="space-y-8">
      {/* Enhanced Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Available Balance</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{Number(account?.balance || 0).toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Trust Score: {((account?.trust_score || 0.8) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Funds on Hold</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{Number(account?.frozen_balance || 0).toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {holdTransactions.length} transactions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Completed</span>
            </div>
            <div className="text-3xl font-bold">
              {completedTransactions.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              ₦{completedTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Active Disputes</span>
            </div>
            <div className="text-3xl font-bold">
              {activeDisputes.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Avg resolution: 2.5 days
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Service Fees</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{totalServiceFees.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Platform revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Based Dashboard */}
      <RoleBasedEscrowDashboard />

      {/* Smart Release Workflow for Held Transactions */}
      {holdTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              Smart Release Workflows ({holdTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {holdTransactions.slice(0, 3).map((transaction) => (
              <SmartReleaseWorkflow
                key={transaction.id}
                transaction={transaction}
                onReleaseComplete={fetchEscrowData}
              />
            ))}
            {holdTransactions.length > 3 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  View All {holdTransactions.length - 3} More Transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EnhancedEscrowPaymentModal onPaymentComplete={fetchEscrowData} />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter Transactions
              </Button>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Dispute Center
              </Button>
            </div>
          </CardContent>
        </Card>

        <ServiceChargeOverview />
      </div>

      <PendingTransactionsManager 
        transactions={transactions}
        onTransactionsUpdated={fetchEscrowData}
      />

      {/* Enhanced Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Enhanced Transaction History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first enhanced escrow payment.</p>
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button className="bg-terracotta hover:bg-terracotta/90">
                    Create First Payment
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Service Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Release Condition</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      ₦{(transaction.service_fee || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.purpose || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {transaction.release_condition || 'Standard'}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'HELD' && (
                        <Button size="sm" variant="outline">
                          Manage
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

export default EscrowHub;
